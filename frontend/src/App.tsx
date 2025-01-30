import { QueryClientProvider, QueryClient } from "react-query";
import AppRoutes from "./router/routes";
import { AuthProvider } from "./store/auth-provider";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

export default App;
