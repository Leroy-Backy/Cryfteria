import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: `${baseUrl}/api`
});

api.interceptors.request.use(
  config => {
    if(!!localStorage.getItem("jwt")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("jwt")}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if(error.response && error.response.status === 401) {
      //todo mb redirect to login
      alert("401 Unauthorized!");
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;