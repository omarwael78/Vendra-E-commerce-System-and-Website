import { storage } from "../utils/storage.js";
import { productService } from "./productService.js";

export const orderService = {
  create(order) {
    return storage.add("orders", order);
  },

  getByUser(userId) {
    return storage.get("orders").filter((o) => o.userId === userId);
  },

  getAll() {
    return storage.get("orders");
  },

  getByVendor(vendorId) {
    const allOrders = this.getAll();

    return allOrders.flatMap((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendorId === vendorId,
      );
      return vendorItems.map((item) => {
        return {
          ...item,
          orderId: order.id,
          status: order.status,
          date: order.createdAt,
        };
      });
    });
  },

  updateStatus(orderId, status) {
    return storage.update("orders", orderId, {
      status,
    });
  },

  getById(orderId) {
    const orders = this.getAll();
    return orders.filter((o) => o.id === orderId)[0];
  },

  updateStock(order) {
    const products = order.items;

    const hasInsufficientStock = products.some((element) => {
      const product = productService.getById(element.productId);
      const newStock = product.stock - element.quantity;
      return newStock < 0;
    });

    if (hasInsufficientStock) return false;

    products.forEach((element) => {
      const product = productService.getById(element.productId);
      const newStock = product.stock - element.quantity;
      productService.updateProductStock(element.productId, newStock);
    });

    return true;
  },
};
