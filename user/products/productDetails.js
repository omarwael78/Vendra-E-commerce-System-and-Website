import { getBasePath } from "../../assets/utils/basePath.js";
import { navbar, initNavBar } from "../../components/user/navbar.js";
import { footer, initFooter } from "../../components/user/footer.js";
import { productService } from "../../DataBase/services/productService.js";

import { initCard } from "../../components/user/card.js";

//  Load Page
$(function () {
  $("body").prepend(navbar(getBasePath())).append(footer(getBasePath()));
  initNavBar(getBasePath());
  initFooter(getBasePath());

  //  Get product ID
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || 1;
  const product = productService.getById(productId);

  const thumbnails = product.images;

  $("#productDetails").html(`
    <div class="row g-4">
     <div class="col-lg-2">
    <!-- 🔙 Back to Products -->
    <a href="../products/index.html" class="text-decoration-none fw-bold">
      ← Back to Products
    </a>
  </div>
    </div>
    <br>
    <div class="row g-4">
   

      <!-- Images -->
      <div class="col-lg-6">
        <div class="card border-0 shadow p-3 ">
        ${
          product.featured
            ? `  <div class="featured-badge z-1">
                    <i class="fa-solid fa-star me-1"></i>
                    <span>FEATURED</span>
                 </div>`
            : ""
        }
          <img src="${product.images[0]}" class="img-fluid main-img" id="mainImage">
        </div>

        <div class="d-flex gap-3 mt-3 justify-content-center">
          ${thumbnails
            .map(
              (src) => `
            <img src="${src}" class="img-thumbnail thumb">
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Details -->
      <div class="col-lg-6 ">
        <h4 class="fw-bold">${product.title}</h4>
        <div class="justify-content-center rating mb-2">
          ${renderStars(Math.round(product.rating))}
          <span class="text-muted ms-2">${product.rating} (${product.reviews.length} reviews)</span>
        </div>

        <div class="mb-3">
          <span class="fs-3 fw-bold text-primary">$${product.finalPrice.toFixed(2)}</span>
          <span class="old-price ms-2">$${product.price}</span>
          <span class="badge bg-success ms-2">Save ${product.discount}</span>
        </div>

        <p class="text-success fw-semibold">
          <i class="fa-solid fa-circle-check"></i> In Stock
        </p>

        <!-- Quantity -->
        <div class="d-flex justify-content-center gap-3 mb-4">
          <span>Quantity</span>
          <div class="input-group" style="width:130px;">
            <button class="btn btn-outline-secondary" id="minus">-</button>
            <input type="text" id="qty" class="form-control text-center" value="1">
            <button class="btn btn-outline-secondary" id="plus">+</button>
          </div>
          <span class="text-muted">Total: $<span id="totalPrice">${product.finalPrice.toFixed(2)}</span></span>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-2 mb-4">
          <button data-productId=${product.id} class="btn btn-primary flex-grow-1 addToCartBtn">
            <i class="bi bi-cart"></i> Add to Cart
          </button>

        </div>

        <!-- Shipping -->
        <div class="bg- p-3 rounded">
          <p class="mb-1"><i class="bi bi-truck"></i> Free shipping on orders over $50</p>
          <p class="mb-0"><i class="bi bi-shield-check"></i> 2-year warranty included</p>
        </div>

      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-5">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#desc">Description</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#specs">Specifications</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">Reviews</button>
        </li>
      </ul>

      <div class="tab-content p-4 border border-top-0">

        <div class="tab-pane fade show active" id="desc">
          ${product.desc}
        </div>

        <div class="tab-pane fade p-2" id="specs">
          <div class="row p-3 text-start border-bottom"><span class="col-6">Category</span>  <span class="col-6">${product.category}</span></div>
          <div class="row p-3 text-start border-bottom"><span class="col-6">Weight</span>  <span class="col-6">${product.weight} KG</span></div>
        </div>

        <div class="tab-pane fade" id="reviews">
          ${product.reviews.length ? ` <div id="reviewsContainer" class="row"> </div>` : `<p>No reviews available.</p>`}
        </div>

      </div>
    </div>
  `);

  // Quantity logic
  let qty = 1;
  $("#plus").click(() => {
    qty++;
    $("#qty").val(qty);
    $("#totalPrice").text((qty * product.finalPrice).toFixed(2));
  });

  $("#minus").click(() => {
    if (qty > 1) qty--;
    $("#qty").val(qty);
    $("#totalPrice").text((qty * product.finalPrice).toFixed(2));
  });

  initCard();

  function renderStars(num) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fa-${i <= num ? "solid" : "regular"} fa-star text-warning"></i>`;
    }
    return stars;
  }
  function renderReviews(reviews) {
    reviews.forEach((element) => {
      $("#reviewsContainer").append(`
        <div class="col-lg-4 col-xl-3 mb-5 mb-md-0 col-md-6 col-12">
      <h5 class="mb-3">${element.reviewerName}</h5>
      <h6 class="text-primary mb-3">${element.reviewerEmail}</h6>
      <p class="px-xl-3">
        <i class="fas fa-quote-left pe-2"></i>${element.comment}
      </p>
        ${renderStars(element.rating)}
    </div>`);
    });
  }
  renderReviews(product.reviews);
  $(".thumb").hover(function () {
    $("#mainImage").attr("src", $(this).attr("src"));
  });
});
