import { getCookie, setCookie } from "@/utils/cookie/cookie";
import axios from "axios";

const api = axios.create({
  baseURL: "https://randomuser.me/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await getNewTokens();

        if (res?.accessToken) {
          setCookie("accessToken", res.accessToken, 30);
          setCookie("refreshToken", res.refreshToken, 360);

          originalRequest.headers["Authorization"] = `Bearer ${res.accessToken}`;
          return api(originalRequest);
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }
    }

    return Promise.reject(error?.response?.data || error.message);
  }
);

export default api;

const getNewTokens = async () => {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) return {};

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });

    return res?.data || {};
  } catch {
    return {};
  }
};

const clearTokens = () => {
  setCookie("accessToken", "", 0);
  setCookie("refreshToken", "", 0);
};
