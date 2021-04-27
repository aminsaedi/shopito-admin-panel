import client from "./client";

const endpoint = "/product";

const getAllProductsInBranch = (branchId) =>
  client.get(endpoint + "/branch/" + branchId);

const newProduct = (name, barcode, branchId, price, numberInStock) =>
  client.post(endpoint, { name, barcode, branchId, price, numberInStock });

const deleteProduct = (productId) => client.delete(endpoint + "/" + productId);

const updateProductPrice = (productId, price) =>
  client.put(endpoint + "/" + productId, { price });

const updateProductNumberInStock = (productId, numberInStock) =>
  client.put(endpoint + "/" + productId, { numberInStock });

const updateProductName = (productId, name) =>
  client.put(endpoint + "/" + productId, { name });

const updateProductBarcode = (productId, barcode) =>
  client.put(endpoint + "/" + productId, { numberInStock: barcode });

export default {
  getAllProductsInBranch,
  newProduct,
  deleteProduct,
  updateProductPrice,
  updateProductName,
  updateProductNumberInStock,
  updateProductBarcode,
};
