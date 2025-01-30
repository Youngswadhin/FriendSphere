import { AtSign, Eye, EyeOff, KeyRound, Sparkles } from "lucide-react";
import Modal, { ModalRef } from "../../../component/modal/modal";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import apiRequest from "@/utils/api";
import { useAuth } from "@/store/auth-provider";
import { User } from "@/types/types";
import { toast } from "react-toastify";

const LoginModal = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { setIsAuthenticated, setUser } = useAuth();
  const modalRef = useRef<ModalRef>(null);
  const [loading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiRequest<{ user: User }>({
        url: "/auth/login",
        method: "POST",
        body: values,
      })
        .then((res) => {
          if (res.status === 200) {
            setUser(res.data.user);
            setIsAuthenticated(true);
            modalRef.current?.close();
          }
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <Modal
      ref={modalRef}
      heading="Login"
      trigger={
        <Button variant="outline" size={"lg"}>
          Login
          <Sparkles
            className="-me-1 ms-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      }
    >
      <div className="flex-col flex px-4 py-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={"email"}>Enter Email</Label>
          <div className="relative">
            <Input
              id={"email"}
              className="peer ps-9"
              placeholder="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <AtSign size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={"password"}>Enter Password</Label>
          <div className="relative">
            <Input
              id={"password"}
              className="pe-9"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <Button variant="default" onClick={() => formik.handleSubmit()}>
          {loading ? (
            "Loading..."
          ) : (
            <>
              Login
              <KeyRound
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
