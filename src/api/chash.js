import client from "./client";

const endpoint = "/chash";

const loginChash = (username, password) =>
  client.post(endpoint + "/login", { username, password });

const registerChash = (name, username, password, branchId) =>
  client.post(endpoint + "/register", { name, username, password, branchId });

export default {
  loginChash,
  registerChash,
};
