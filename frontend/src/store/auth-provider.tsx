import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { User } from "../types/types";
import apiRequest from "../utils/api";
import { useCookies } from "react-cookie";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUser = async (): Promise<User> => {
  const { data } = await apiRequest<User>({ method: "GET", url: "/auth" });
  return data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [{ jwt }, , removeJwt] = useCookies(["jwt"]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const {
    data: fetchedUser,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    enabled: false,
    queryKey: ["user"],
    queryFn: fetchUser,
    onError: (error) => {
      console.error(error);
      console.log(jwt);
      removeJwt("jwt");
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
      setIsAuthenticated(true);
    }
  }, [fetchedUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
