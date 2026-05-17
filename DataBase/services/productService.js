import { storage } from "../utils/storage.js";

export const productService = {
  //helper functions
  productExists(vendorId, title) {
    const products = storage.get("products");
    return products.some(
      (p) =>
        p.vendorId === vendorId &&
        p.title.trim().toLowerCase() === title.trim().toLowerCase(),
    );
  },

  create(product) {
    if (this.productExists(product.vendorId, product.title)) {
      throw new Error("You already added a product with this title");
    }
    return storage.add("products", product);
  },

  remove(productId) {
    return storage.delete("products", productId);
  },

  updateProduct(productID, data) {
    return storage.update("products", productID, data);
  },

  updateProductStock(productID, stock) {
    return storage.update("products", productID, { stock });
  },

  getAll() {
    return storage.get("products");
  },
  getById(productId) {
    return storage.get("products").filter((p) => p.id === productId)[0];
  },

  getByVendor(vendorId) {
    return storage.get("products").filter((p) => p.vendorId === vendorId);
  },

  approve(productId) {
    return storage.update("products", productId, {
      approved: true,
    });
  },

  isInStock(productId) {
    return this.getById(productId).stock > 0;
  },
};
