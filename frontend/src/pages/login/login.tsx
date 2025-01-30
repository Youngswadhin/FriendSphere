import { useAuth } from "@/store/auth-provider";
import LoginModal from "./modals/login-modal";
import SignupModal from "./modals/signup-modal";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-100 flex-col">
      <div className="app-name text-[clamp(50px,10vw,150px)] font-bold text-gray-500">
        Friendship
      </div>
      <div className="flex gap-3">
        <LoginModal />
        <SignupModal />
      </div>
    </div>
  );
};

export default Login;
