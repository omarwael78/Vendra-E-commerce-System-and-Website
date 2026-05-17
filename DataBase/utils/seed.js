import User from "../models/User.js";
import Product from "../models/Product.js";

import { userService } from "../services/userService.js";
import { productService } from "../services/productService.js";
import { cartService } from "../services/cartService.js";
import { orderService } from "../services/orderService.js";
import { storage } from "../utils/storage.js";

async function initSeed() {
  const existingProducts = productService.getAll() || [];

  if (existingProducts.length > 0) {
    console.log("📦 Data already exists in storage. Skipping seed.");
    return;
  }

  console.log("🌱 Storage is empty. Starting seed process...");

  // Reset storage
  storage.set("users", []);
  storage.set("products", []);
  storage.set("carts", []);
  storage.set("orders", []);

  // ==================== USERS ====================

  // Admins
  const admin1 = new User({
    name: "System Admin",
    email: "admin@vendra.com",
    password: "admin1234",
    role: "admin",
  });
  userService.create(admin1);

  // Vendors - Each specialized in different product categories
  const techVendor = new User({
    name: "TechStore",
    email: "tech@vendra.com",
    password: "vendor1234",
    role: "vendor",
    phone: "+1555111222",
    address: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    zipcode: "94102",
    country: "USA",
  });
  userService.create(techVendor);

  const fashionVendor = new User({
    name: "Fashion Hub",
    email: "fashion@vendra.com",
    password: "vendor1234",
    role: "vendor",
    phone: "+1555222333",
    address: "456 Fashion Ave",
    city: "New York",
    state: "NY",
    zipcode: "10001",
    country: "USA",
  });
  userService.create(fashionVendor);

  const homeVendor = new User({
    name: "Home Essentials",
    email: "home@vendra.com",
    password: "vendor1234",
    role: "vendor",
    phone: "+1555333444",
    address: "789 Home Blvd",
    city: "Chicago",
    state: "IL",
    zipcode: "60601",
    country: "USA",
  });
  userService.create(homeVendor);

  // Customers
  const customer1 = new User({
    name: "John Doe",
    email: "customer@vendra.com",
    password: "customer1234",
    role: "customer",
    phone: "+1555444555",
    address: "321 Customer Lane",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90001",
    country: "USA",
  });
  userService.create(customer1);

  const customer2 = new User({
    name: "Emma Wilson",
    email: "emma@vendra.com",
    password: "customer1234",
    role: "customer",
    phone: "+1555666777",
    address: "654 Shopper St",
    city: "Miami",
    state: "FL",
    zipcode: "33101",
    country: "USA",
  });
  userService.create(customer2);

  const customer3 = new User({
    name: "Michael Brown",
    email: "michael@vendra.com",
    password: "customer1234",
    role: "customer",
    phone: "+1555888999",
    address: "987 Buyer Rd",
    city: "Seattle",
    state: "WA",
    zipcode: "98101",
    country: "USA",
  });
  userService.create(customer3);

  // ==================== PRODUCTS BY CATEGORY ====================

  // Category assignments per vendor
  const techCategories = [
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories",
    "sports-accessories",
  ];
  const fashionCategories = [
    "beauty",
    "fragrances",
    "skin-care",
    "tops",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-bags",
    "womens-dresses",
    "womens-jewellery",
    "womens-shoes",
    "sunglasses",
  ];
  const homeCategories = [
    "furniture",
    "groceries",
    "home-decoration",
    "kitchen-accessories",
    "vehicle",
    "motorcycle",
  ];

  let allProducts = [];

  // Helper function to fetch products by category
  async function fetchProductsByCategory(category, vendorId, approved = true) {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}?limit=5`,
      );
      const { products: rawProducts } = await response.json();

      rawProducts.forEach((item) => {
        const p = new Product({
          vendorId: vendorId,
          title: item.title,
          desc: item.description,
          category: item.category,
          price: item.price,
          discount: item.discountPercentage,
          rating: item.rating,
          stock: item.stock,
          reviews: item.reviews || [],
          weight: item.weight || 0.5,
          images: item.images,
          approved: approved,
        });
        productService.create(p);
        allProducts.push(p);
      });
    } catch (error) {
      console.error(`Failed to fetch ${category}:`, error);
    }
  }

  // Fetch Tech Products
  console.log("📱 Fetching tech products...");
  for (const category of techCategories) {
    await fetchProductsByCategory(category, techVendor.id);
  }

  // Fetch Fashion Products
  console.log("👗 Fetching fashion products...");
  for (const category of fashionCategories) {
    await fetchProductsByCategory(category, fashionVendor.id);
  }

  // Fetch Home Products
  console.log("🏠 Fetching home products...");
  for (const category of homeCategories) {
    await fetchProductsByCategory(category, homeVendor.id);
  }

  // Add some unapproved products for admin to approve
  const unapprovedProduct1 = new Product({
    vendorId: techVendor.id,
    title: "New Tech Gadget Pro",
    desc: "Latest tech gadget awaiting approval",
    category: "electronics",
    price: 299.99,
    discount: 10,
    rating: 0,
    stock: 50,
    reviews: [],
    weight: 0.8,
    images: ["https://placehold.net/400x400.png"],
    approved: false,
  });
  productService.create(unapprovedProduct1);

  const unapprovedProduct2 = new Product({
    vendorId: fashionVendor.id,
    title: "Designer Handbag Collection",
    desc: "Elegant designer handbag pending review",
    category: "accessories",
    price: 159.99,
    discount: 5,
    rating: 0,
    stock: 25,
    reviews: [],
    weight: 0.5,
    images: ["https://placehold.net/400x400.png"],
    approved: false,
  });
  productService.create(unapprovedProduct2);

  const unapprovedProduct3 = new Product({
    vendorId: homeVendor.id,
    title: "Smart Home Device",
    desc: "Innovative smart home device awaiting approval",
    category: "smart-home",
    price: 89.99,
    discount: 15,
    rating: 0,
    stock: 100,
    reviews: [],
    weight: 1.2,
    images: ["https://placehold.net/400x400.png"],
    approved: false,
  });
  productService.create(unapprovedProduct3);

  // Refresh allProducts after seeding
  allProducts = productService.getAll();

  // ==================== CARTS ====================

  // Customer 1 has items in cart
  if (allProducts.length >= 3) {
    cartService.addItem(customer1.id, allProducts[0].id, 2);
    cartService.addItem(customer1.id, allProducts[5].id, 1);
    cartService.addItem(customer1.id, allProducts[25].id, 3);
  }

  // Customer 2 has items in cart
  if (allProducts.length >= 6) {
    cartService.addItem(customer2.id, allProducts[2].id, 1);
    cartService.addItem(customer2.id, allProducts[40].id, 2);
  }

  // ==================== ORDERS ====================

  // Helper function to create order
  function createOrder(userId, items, status, daysAgo = 0) {
    const productsDB = allProducts;
    const cartItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const order = {
      id: crypto.randomUUID(),
      userId: userId,
      items: cartItems
        .map((item) => {
          const product = productsDB.find((p) => p.id === item.productId);
          if (!product) return null;
          return {
            productId: item.productId,
            productTitle: product.title,
            productImage: product.images[0],
            vendorId: product.vendorId,
            price: product.finalPrice,
            quantity: item.quantity,
            total: product.finalPrice * item.quantity,
          };
        })
        .filter(Boolean),
      totalPrice: 0,
      status: status,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    };

    order.totalPrice = order.items.reduce((sum, item) => sum + item.total, 0);
    return order;
  }

  // Orders for Customer 1 - Mixed products from different vendors
  if (allProducts.length >= 30) {
    // Order 1 - Delivered (15 days ago) - Tech products
    const order1 = createOrder(
      customer1.id,
      [
        { productId: allProducts[0].id, quantity: 1 },
        { productId: allProducts[5].id, quantity: 2 },
      ],
      "delivered",
      15,
    );
    storage.add("orders", order1);

    // Order 2 - Shipped (5 days ago) - Fashion products
    const order2 = createOrder(
      customer1.id,
      [
        { productId: allProducts[25].id, quantity: 1 },
        { productId: allProducts[30].id, quantity: 1 },
      ],
      "Shipped",
      5,
    );
    storage.add("orders", order2);
  }

  // Orders for Customer 2
  if (allProducts.length >= 50) {
    // Order 4 - Delivered (20 days ago) - Fashion products
    const order4 = createOrder(
      customer2.id,
      [
        { productId: allProducts[35].id, quantity: 2 },
        { productId: allProducts[40].id, quantity: 1 },
      ],
      "delivered",
      20,
    );
    storage.add("orders", order4);

    // Order 5 - Pending (1 day ago) - Mixed products
    const order5 = createOrder(
      customer2.id,
      [
        { productId: allProducts[10].id, quantity: 1 },
        { productId: allProducts[50].id, quantity: 2 },
      ],
      "pending",
      1,
    );
    storage.add("orders", order5);

    // Order 6 - Cancelled (10 days ago)
    const order6 = createOrder(
      customer2.id,
      [{ productId: allProducts[60].id, quantity: 1 }],
      "cancelled",
      10,
    );
    storage.add("orders", order6);
  }

  // Orders for Customer 3
  if (allProducts.length >= 60) {
    // Order 7 - Delivered (30 days ago)
    const order7 = createOrder(
      customer3.id,
      [
        { productId: allProducts[3].id, quantity: 1 },
        { productId: allProducts[45].id, quantity: 2 },
        { productId: allProducts[80].id, quantity: 1 },
      ],
      "delivered",
      30,
    );
    storage.add("orders", order7);

    // Order 8 - Shipped (3 days ago)
    const order8 = createOrder(
      customer3.id,
      [{ productId: allProducts[15].id, quantity: 1 }],
      "Shipped",
      3,
    );
    storage.add("orders", order8);
  }

  console.log("✅ Seeding completed!");
  console.log(`   - ${userService.getAll().length} users`);
  console.log(`   - ${productService.getAll().length} products`);
  console.log(`   - ${storage.get("carts").length} carts`);
  console.log(`   - ${orderService.getAll().length} orders`);
}

export const seedReady = initSeed();
