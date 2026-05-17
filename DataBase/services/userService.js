import { storage } from "../utils/storage.js";
import { cartService } from "./cartService.js";
import { productService } from "./productService.js";

export const userService = {
  //  HELPERS

  emailExists(email) {
    const users = storage.get("users") || [];
    return users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
  },

  getCurrentUser() {
    const localUser = localStorage.getItem("currentUser");
    if (localUser) return JSON.parse(localUser);

    const sessionUser = sessionStorage.getItem("currentUser");
    if (sessionUser) return JSON.parse(sessionUser);

    return null;
  },

  setCurrentUser(user, remember = false) {
    if (remember) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.removeItem("currentUser");
    }
  },

  deleteCurrentUser() {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
  },

  //  CRUD

  create(user) {
    if (this.emailExists(user.email)) {
      throw new Error("Email already registered");
    }
    return storage.add("users", user);
  },

  getAll() {
    return storage.get("users") || [];
  },

  getById(id) {
    return storage.find("users", id);
  },

  update(id, data) {
    const updatedUser = storage.update("users", id, data);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      const isRemembered = localStorage.getItem("currentUser") !== null;

      this.setCurrentUser(updatedUser, isRemembered);
    }

    return updatedUser;
  },

  delete(id) {
    let userProducts = productService.getByVendor(id);
    userProducts.forEach((element) => {
      productService.remove(element.id);
    });
    cartService.clearCart(id);

    // Only clear session if user deleting self
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.deleteCurrentUser();
    }

    return storage.delete("users", id);
  },
};
