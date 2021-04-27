import client from "./client";

const endpoint = "/shopping";

const startShopping = (customerId, branchId) =>
  client.post(endpoint, { customerId, branchId });

const addToCart = (shoppingId, productId) =>
  client.post(endpoint + "/add", { shoppingId, productId });

const finishShopping = (shoppingId, state) =>
  client.post(endpoint + "/finish", { shoppingId, state });

const activeShoppings = (branchId) => client.get(endpoint + "/" + branchId);

export default {
  startShopping,
  addToCart,
  finishShopping,
  activeShoppings,
};
