import { storage } from "../utils/storage.js";

export const cartService = {
  // Helper to get all carts from storage
  _getAllCarts() {
    return storage.get("carts") || [];
  },

  getCart(userId) {
    const carts = this._getAllCarts();
    const cart = carts.find((c) => c.userId === userId);
    return cart || { userId, items: [] };
  },

  saveCart(cart) {
    const carts = this._getAllCarts();
    const index = carts.findIndex((c) => c.userId === cart.userId);

    if (index === -1) {
      carts.push(cart);
    } else {
      carts[index] = cart;
    }
    storage.set("carts", carts);
  },

  addItem(userId, productId, qty = 1) {
    const cart = this.getCart(userId);
    const existing = cart.items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    this.saveCart(cart);
  },

  removeItem(userId, productId) {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    this.saveCart(cart);
  },

  clearCart(userId) {
    const carts = this._getAllCarts().filter((c) => c.userId !== userId);
    storage.set("carts", carts);
  },

  getCartCount(userId) {
    let totalCount = 0;
    const userCart = this.getCart(userId);
    userCart.items.forEach((element) => {
      totalCount += element.quantity;
    });
    return totalCount;
  },
};
