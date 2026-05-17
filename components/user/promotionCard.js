import { cartService } from "../../DataBase/services/cartService.js";
import { userService } from "../../DataBase/services/userService.js";
import { initToast } from "../../utils/toast.js";

export function promotionCard(
  id,
  image,
  productTitle,
  stars,
  reviews,
  price,
  finalPrice,
  basePath,
) {
  // Calculate discount percentage
  const discount = Math.round(((price - finalPrice) / price) * 100);

  return `
    <div class="cardContainer col-12 col-lg-6 col-xl-3 my-3">
        <div class="card  modern-card h-100 border-0 shadow-sm overflow-hidden">
            <div class="card-badges z-1">
                <span class="promo-badge badge-discount">-${discount}%</span>
            </div>

            <a href="${basePath}/user/products/product-details.html?id=${id}" class="image-wrapper position-relative">
                <img src="${image}" class="card-img-top object-fit-cover" alt="${productTitle}">
                <span class="promo-badge badge-hot z-1">
                    <i class="fa-solid fa-fire"></i> HOT DEAL
                </span>
            </a>

            <div class="card-body d-flex flex-column p-3">
                <div class="rating-row mb-1">
                    <span class="stars-gold">${renderStars(Math.round(stars))}</span>
                    <span class="text-muted small">(${reviews})</span>
                </div>

                <a class="product-link h6 fw-bold mb-2 text-decoration-none" 
                   href="${basePath}/user/products/product-details.html?id=${id}">
                   ${productTitle}
                </a>

                <div class="mt-auto pt-2">
                    <div class="price-container d-flex align-items-baseline gap-2 mb-3">
                        <span class="current-price text-primary h4 fw-bold mb-0">$${finalPrice.toFixed(2)}</span>
                        <span class="old-price text-muted text-decoration-line-through small">$${price}</span>
                    </div>

                    <button data-productId="${id}" class="text-body addToCartBtn btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span >Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderStars(num) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fa-${i <= num ? "solid" : "regular"} fa-star"></i>`;
  }
  return stars;
}

export function initCard() {
  updateCartCount();
  // Inside your click handler in initCard()
  $(document).on("click", ".addToCartBtn", function () {
    const $btn = $(this);
    const originalContent = $btn.html();

    // Logic for user check...

    // Add effect
    $btn.prop("disabled", true).addClass("btn-success").removeClass("btn-dark");
    $btn.html('<i class="fa-solid fa-check"></i> Added!');

    // Call service
    cartService.addItem(userId, productId, quantity);
    updateCartCount();

    // Revert button after 1.5s
    setTimeout(() => {
      $btn
        .prop("disabled", false)
        .addClass("btn-dark")
        .removeClass("btn-success");
      $btn.html(originalContent);
    }, 1500);
  });
  $(document)
    .off("click", ".addToCartBtn")
    .on("click", ".addToCartBtn", function () {
      const currentUser = userService.getCurrentUser();

      if (!currentUser) {
        initToast("Please login first", "warning");
        return;
      }

      const userId = currentUser.id;
      const productId = $(this).attr("data-productId");

      // Read quantity dynamically if exists (details page)
      const quantity = parseInt($("#qty").val()) || 1;

      cartService.addItem(userId, productId, quantity);

      updateCartCount();
    });

  function updateCartCount() {
    const currentUser = userService.getCurrentUser();
    const count = currentUser ? cartService.getCartCount(currentUser.id) : 0;

    $("#cartCount").text(count);
    $("#cartCountMobile").text(count);
  }
}
