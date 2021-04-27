import client from "./client";

const endpoint = "/customer";

const registerCustomer = (name, mobile) =>
  client.post(endpoint + "/register", { name, mobile });

const loginCustomer = (mobile) => client.post(endpoint + "/login");

const OTPCheck = (mobile, OTP) =>
  client.post(endpoint + "/OTP", { mobile, OTP });

export default {
  registerCustomer,
  loginCustomer,
  OTPCheck,
};
