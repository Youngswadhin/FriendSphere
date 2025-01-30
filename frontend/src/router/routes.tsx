// import Home from '../components/Home';
// import About from '../components/About';
// import Contact from '../components/Contact';

import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "../pages/home/home";
import ProtectedRoute from "../pages/protected-route/procted-route";
import { useAuth } from "../store/auth-provider";
import Login from "../pages/login/login";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useCookies } from "react-cookie";

const Layout = () => {
  const [{ jwt }, , removeJwt] = useCookies(["jwt"]);
  const { isAuthenticated, isLoading, user, setUser, setIsAuthenticated } =
    useAuth();
  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!isAuthenticated) return <Outlet />;
  return (
    <div className="main w-[100vw] h-[100vh] relative ]">
      <div className="fixed w-full flex justify-between items-center px-3 py-1.5 bg-white/40 z-[9999]">
        <div className="name font-bold text-xl">
          Hi {user?.name?.split(" ")[0]}!
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="acc w-9 aspect-square rounded-full border-2 border-gray-400 hover:scale-105 duration-150 flex items-center justify-center">
              {user?.name
                ?.split(" ")
                .slice(0, 2)
                .map((e) => e.charAt(0))}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-md shadow-lg border-gray-200 border-2">
              <div className="name font-medium text-lg text-gray-500">
                {user?.name}
              </div>
              <div className="email font-light text-xs text-gray-400">
                {user?.email}
              </div>
              <button
                onClick={() => {
                  if (jwt) {
                    removeJwt("jwt");
                  }
                  setIsAuthenticated(false);
                  setUser(null);
                }}
                className="logout mt-2 px-2 py-0.5 text-sm w-full bg-red-100 rounded-md hover:bg-red-500 text-gray-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Outlet />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<>no page</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
