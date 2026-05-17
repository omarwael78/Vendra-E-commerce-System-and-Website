import { cartService } from "../../DataBase/services/cartService.js";
import { userService } from "../../DataBase/services/userService.js";
import { initToast } from "../../utils/toast.js";

export function productCard(
  id,
  image,
  productTitle,
  stars,
  reviews,
  price,
  finalPrice,
  featured,
  basePath,
) {
  return `
        <div class="cardContainer col-12  col-lg-6 col-xl-4 my-2">
        <div class="card p-0 h-100  position-relative">
                        ${
                          featured
                            ? `
                                <div class="featured-badge z-1">
                                    <i class="fa-solid fa-star me-1"></i>
                                    <span>FEATURED</span>
                                </div>
                            `
                            : ""
                        }
                            <a  href="${basePath}/user/products/product-details.html?id=${id}" class="overflow-hidden h-100"><img src=${image} class="card-img-top  h-100 object-fit-cover"></a>
                    <div class="card-body">
                    <div class="rating">
                           ${renderStars(`${Math.round(stars)}`)}
                       <span class="count">(${reviews})</span>
                        </div>
                        <a class="h6 fw-bold card-title" href="${basePath}/user/products/product-details.html?id=${id}">${productTitle}</a>
                        <div class="d-flex justify-content-between">
                           <div class="d-flex">
                               <p class="h3 fw-bold text-primary me-3">$${finalPrice.toFixed(2)}</p>
                              <p class="text-decoration-line-through m-0 align-self-center">$${price}</p>
                           </div>
                            <button data-productId=${id}  class="addToCartBtn btn btn-primary"><i
                                    class="fa-solid fa-cart-shopping"></i>Add</button>
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
    // $(".cardContainer").click(function(){
    //   window.location.href ;
    // });
    $("#cartCount").text(count);
    $("#cartCountMobile").text(count);
  }
}
