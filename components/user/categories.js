import { category } from "./category.js";
import { productService } from "../../DataBase/services/productService.js";
export function categories() {
  return `<div class="container-xl my-5">
            <p class="h2 fw-bold text-center">Shop by Category</p>
            <p class="text-center">Explore our wide range of products</p>
            <div id="CategoriesContainer" class="column-gap-2 text-center justify-content-around row my-5 ">
            </div>
        </div>`;
}

export function initCategories() {
  let CategoriesContainer = $("#CategoriesContainer");
  let categoriesData = getTopCategories();

  categoriesData.forEach((item) => {
    CategoriesContainer.append(
      category(item.categoryEmoji, item.categoryName, item.categoryItems),
    );
  });
}

const emojiMap = {
  beauty: "💄",
  fragrances: "✨",
  furniture: "🪑",
  groceries: "🍎",
  "home-decoration": "🏠",
  "kitchen-accessories": "🍳",
  laptops: "💻",
  "mens-shirts": "👔",
  "mens-shoes": "👟",
  "mens-watches": "⌚",
  "mobile-accessories": "🎧",
  motorcycle: "🏍️",
  "skin-care": "🧴",
  smartphones: "📱",
  "sports-accessories": "⚽",
  sunglasses: "🕶️",
  tablets: "📟",
  tops: "👕",
  vehicle: "🚗",
  "womens-bags": "👜",
  "womens-dresses": "👗",
  "womens-jewellery": "💍",
  "womens-shoes": "👠",
  "womens-watches": "⌚",
};

export function getTopCategories() {
  let allProducts = productService.getAll();
  const categoryCounts = allProducts.reduce((acc, product) => {
    const cat = product.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryArray = Object.entries(categoryCounts);

  categoryArray.sort((a, b) => b[1] - a[1]);

  return categoryArray.slice(0, 6).map(([name, count]) => ({
    categoryName: name,
    categoryItems: count,
    categoryEmoji: emojiMap[name],
  }));
}
