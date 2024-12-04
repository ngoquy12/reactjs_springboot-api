import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

baseUrl.interceptors.request.use(
  function (request) {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYXB0YWluIHRlZW1vIiwiZXhwIjoxNzQxOTI3MDY0fQ.87_vzcWXKiN-6vOrVCoZ8sN8fcLjkEFMXS2KDIf6Phe3uXSX-WMTYK4xv3JCjDgjtTj7k04qCTMv4kTlaD6T8A";

    // Đính token vào header mới
    const newHeaders = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };

    // Đính header mới vào lại request trước khi được gửi đi
    request = {
      ...request,
      headers: newHeaders,
    };

    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default baseUrl;
