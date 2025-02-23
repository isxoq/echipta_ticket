import axios from "axios";

const $axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

$axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = localStorage.getItem("locale") || "ru";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default $axios;
