import { getBasePath } from "../../../assets/utils/basePath.js";
import { navbar, initNavBar } from "../../../components/user/navbar.js";
import { footer, initFooter } from "../../../components/user/footer.js";
import { productService } from "../../../DataBase/services/productService.js";
import { productCard } from "../../../components/user/card.js";

import { getCachedImage } from "../../../DataBase/utils/cacheHelper.js";
import { initCard } from "../../../components/user/card.js";

$("#mainWrapper").prepend(navbar(getBasePath())).append(footer(getBasePath()));

initNavBar(getBasePath());
initFooter(getBasePath());

//  STATE
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 21;

//  INIT
$(document).ready(function () {
  allProducts = productService.getAll().filter((product) => product.stock > 0);
  filteredProducts = allProducts;

  //  Max Price & Categories
  let prices = allProducts.map((p) => p.price);
  let maxPrice = Math.max(...prices);

  let categories = [...new Set(allProducts.map((p) => p.category))];
  renderFilters(categories, maxPrice);

  //  Auto filter from Category page
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get("category");

  if (selectedCategory) {
    const checkbox = $(`.category-filter[value="${selectedCategory}"]`);
    if (checkbox.length) {
      checkbox.prop("checked", true);
    }
  }
  //initial Call
  refreshProducts();

  //  FILTERS
  $(document).on("change", ".category-filter", function () {
    currentPage = 1;
    refreshProducts();
  });
  $(document).on("input", "#priceRange", refreshProducts);

  //  SEARCH
  $("input[type='search']").on("input", function () {
    currentPage = 1;
    refreshProducts();
  });

  //  CLEAR FILTERS
  $(document).on("click", "#clearFilters", function () {
    $(".category-filter").prop("checked", false);
    $("#priceRange").val(maxPrice);
    $("input[type='search']").val("");

    filteredProducts = allProducts;
    currentPage = 1;
    refreshProducts();
  });

  //  SORT
  $("#sortSelect").on("change", refreshProducts);

  //  PAGINATION
  $(document).on("click", ".page-btn", function () {
    currentPage = +$(this).data("page");
    window.scrollTo(0, 0);
    refreshProducts();
  });

  $(document).on("click", "#prevPage", function () {
    if (currentPage > 1) {
      currentPage--;
      refreshProducts();
    }
  });

  $(document).on("click", "#nextPage", function () {
    let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      refreshProducts();
    }
  });

  //  PRODUCT DETAILS CLICK
  $(document).on("click", ".product-card h6", function (e) {
    e.stopPropagation();
    let productId = $(this).closest(".product-card").data("id");
    window.location.href = `product-details.html?id=${productId}`;
  });

  //  WISHLIST ICON
  $(document).on("click", ".wishlist", function (e) {
    e.stopPropagation();
    $(this).find("i").toggleClass("bi-heart bi-heart-fill");
    $(this).toggleClass("active");
  });

  initCard();
});

//  FILTER LOGIC
function applyFilters() {
  let selectedCategories = $(".category-filter:checked")
    .map(function () {
      return this.value;
    })
    .get();

  let maxPrice = $("#priceRange").val();
  let searchText = $("input[type='search']").val().toLowerCase();

  filteredProducts = allProducts.filter((p) => {
    let catOK =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    let priceOK = p.price <= maxPrice;
    let searchOK = p.title.toLowerCase().includes(searchText);

    return catOK && priceOK && searchOK;
  });

  
}

//  VIEW LOGIC
function updateView() {
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;

  renderProducts(filteredProducts.slice(start, end));
  renderPagination();

  $("#productsCount").text(
    `Showing ${start + 1}-${Math.min(end, filteredProducts.length)} of ${filteredProducts.length} products`,
  );
}

function sortFun() {
  const val = $("#sortSelect").val();

  if (val === "featured")
    filteredProducts.sort((a, b) => b.featured - a.featured);
  if (val === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (val === "high") filteredProducts.sort((a, b) => b.price - a.price);
  if (val === "rating") filteredProducts.sort((a, b) => b.rating - a.rating);
}

function refreshProducts() {
  applyFilters();
  sortFun();
  updateView();
}

//  PAGINATION RENDER
function renderPagination() {
  let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (totalPages <= 1) {
    $("#pagination").html("");
    return;
  }

  let html = `<button id="prevPage" class="btn btn-outline-secondary btn-sm">Previous</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="btn btn-sm ${
        i === currentPage ? "btn-primary" : "btn-outline-secondary"
      } page-btn" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `<button id="nextPage" class="btn btn-outline-secondary btn-sm">Next</button>`;
  $("#pagination").html(html);
}

//  PRODUCTS RENDER
async function renderProducts(products) {
  const cards = await Promise.all(
    products.map(async (p) => {
      const cachedUrl = await getCachedImage(
        p.images[0] || "/assets/vendra-thubnail.png",
      );
      return productCard(
        p.id,
        cachedUrl,
        p.title,
        p.rating,
        p.reviews.length,
        p.price,
        p.finalPrice,
        p.featured,
        getBasePath(),
      );
    }),
  );

  $("#products").empty();
  $("#products").append(cards.join(""));
}
