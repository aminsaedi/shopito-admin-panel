import client from "./client";

const endPoint = "/onlinePayment";

const getOnlinePaymentsInBranch = (branchId) =>
  client.post(endPoint + "/inBranch", { branchId });

const deleteOnlinePayment = (paymnetId) =>
  client.delete(endPoint + "/" + paymnetId);

export default {
  getOnlinePaymentsInBranch,
  deleteOnlinePayment,
};
