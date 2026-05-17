import { requireFields } from "../utils/validator.js";

export default class User {
  constructor({
    name,
    password,
    email,
    role,
    phone,
    address,
    image,
    city,
    state,
    zipcode,
    country,
  }) {
    requireFields({ name, password, email, role }, [
      "name",
      "password",
      "email",
      "role",
    ]);

    // Simple enum validation
    if (!["admin", "customer", "vendor"].includes(role)) {
      throw new Error("Invalid role");
    }

    // Core fields
    this.id = crypto.randomUUID();
    this.createdAt = Date.now();
    this.name = name;
    this.password = btoa(password);
    this.email = email;
    this.role = role;

    // Optional fields
    this.phone = phone || "";
    this.address = address || "";
    this.image = image || "";
    this.city = city || "";
    this.state = state || "";
    this.zipcode = zipcode || "";
    this.country = country || "";
  }
}
