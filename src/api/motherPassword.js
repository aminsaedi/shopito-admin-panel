import client from "./client";

const endPoint = "/motherPassword/verify";

const checkPassword = (password) => client.post(endPoint, { password });

export default {
  checkPassword,
};
