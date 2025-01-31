import { AtSign, CircleUser, Plus, UserRoundPlus } from "lucide-react";
import Modal, { ModalRef } from "../../../component/modal/modal";
import { Button } from "../../../components/ui/button";
import * as Yup from "yup";
import { useFormik } from "formik";
import InputField from "../../../component/input-field/input-field";
import SelectField from "../../../component/select-field/select-field";
import apiRequest from "@/utils/api";
import { User } from "@/types/types";
import { useAuth } from "@/store/auth-provider";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

const SignupModal = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const modalRef = useRef<ModalRef>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik<{
    email: string;
    password: string;
    name: string;
    age: string;
    address: {
      city: string;
      zip: string;
      country: string;
      state: string;
      location: {
        lat: string;
        long: string;
      };
    };
    hobbies: { value: string; label: string }[];
    image: string;
  }>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      age: "",
      address: {
        city: "",
        zip: "",
        country: "",
        state: "",
        location: {
          lat: "",
          long: "",
        },
      },
      hobbies: [],
      image: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      apiRequest<{ user: User }>({
        url: "/auth/sign-up",
        method: "POST",
        body: {
          ...values,
          age: Number(values.age),
          address: {
            ...values.address,
            location: {
              lat: Number(values.address.location.lat),
              long: Number(values.address.location.long),
            },
          },
          hobbies: values.hobbies.map((hobby) => hobby.value),
          image: "",
        },
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
          setLoading(false);
        });
    },
  });

  return (
    <Modal
      ref={modalRef}
      heading="Sign Up"
      trigger={
        <Button variant="outline" size={"lg"}>
          Sign Up
          <UserRoundPlus
            className="-me-1 ms-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      }
      className="w-[clamp(300px,600px,90vw)]"
    >
      <div className="flex-col flex md:px-4 py-3 gap-2">
        <div className="flex gap-2 w-full">
          <InputField
            name="email"
            title="Enter Email"
            placeholder="Email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            preIcon={AtSign}
            flex={1}
          />
          <InputField
            name="password"
            title="Password"
            placeholder="Password"
            type="text"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            password
            flex={1}
          />
        </div>
        <div className="flex gap-2 w-full">
          <InputField
            name="name"
            title="Enter Name"
            placeholder="Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            preIcon={CircleUser}
            flex={1}
          />
          <InputField
            name="age"
            title="Enter Age"
            placeholder="Age"
            type="text"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
        </div>
        <div className="flex gap-2 w-full">
          <InputField
            name="address.country"
            title="Enter Country"
            placeholder="Country"
            type="text"
            value={formik.values.address.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
          <InputField
            name="address.state"
            title="Enter State"
            placeholder="State"
            type="text"
            value={formik.values.address.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
        </div>
        <div className="flex gap-2 w-full">
          <InputField
            name="address.city"
            title="Enter City"
            placeholder="City"
            type="text"
            value={formik.values.address.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
          <InputField
            name="address.zip"
            title="Enter Zip"
            placeholder="Zip"
            type="number"
            value={formik.values.address.zip}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
        </div>
        <div className="flex gap-2 w-full">
          <InputField
            name="address.location.lat"
            title="Enter Latitude"
            placeholder="Latitude"
            type="text"
            value={formik.values.address.location.lat}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
          <InputField
            name="address.location.long"
            title="Enter Longitude"
            placeholder="Longitude"
            type="text"
            value={formik.values.address.location.long}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            flex={1}
          />
        </div>
        <SelectField
          creatable
          name="hobbies"
          title="Enter Hobbies"
          placeholder="Write & Enter to add"
          value={formik.values.hobbies}
          onChange={(data) => formik.setFieldValue("hobbies", data)}
          options={[
            { value: "reading", label: "Reading" },
            { value: "traveling", label: "Traveling" },
            { value: "cooking", label: "Cooking" },
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
          ]}
          flex={1}
        />

        <Button
          variant="default"
          className="mt-2"
          type="button"
          onClick={() => formik.handleSubmit()}
        >
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              Sign up
              <Plus
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

export default SignupModal;