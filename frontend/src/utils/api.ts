import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Add CORS headers to the request
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE, OPTIONS";
axios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "Content-Type, Authorization";

interface ApiRequestParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

async function apiRequest<T>({
  url,
  method,
  body,
  headers,
  params,
}: ApiRequestParams): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    url: `${BASE_API_URL}${url}`,
    method,
    headers,
    params,
    data: body,
    withCredentials: true,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      console.error("Axios error:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      // Handle other errors
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}

export default apiRequest;
