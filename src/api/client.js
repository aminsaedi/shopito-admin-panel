import { create } from "apisauce";
// import authStorage from "../';

const apiClient = create({
  baseURL: "http://192.168.1.21:5000/api",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = localStorage.getItem("token");
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

export default apiClient;
