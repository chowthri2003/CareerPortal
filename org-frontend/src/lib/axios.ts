import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};

axiosInstance.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});