import { getBasePath } from "../../assets/utils/basePath.js";
import { navbar, initNavBar } from "../../components/user/navbar.js";
import { footer, initFooter } from "../../components/user/footer.js";

import { cartService } from "../../DataBase/services/cartService.js";
import { userService } from "../../DataBase/services/userService.js";
import { productService } from "../../DataBase/services/productService.js";
import { initToast } from "../../utils/toast.js";

/* Cart Item Layout (NEW UI) */
function cartItem(product, element) {
  let total = (product.finalPrice * element.quantity).toFixed(2);
  const isDisabled = element.quantity <= 1 ? "disabled" : "";
  return `
  <div class="border-bottom p-3">
    <div class="row align-items-center">

      <div class="col-3 col-md-2">
        <img src="${product.images[0]}" class="img-fluid rounded">
      </div>

      <div class="col-9 col-md-4">
        <h6 class="mb-1">${product.title}</h6>
        <span class="text-primary fw-semibold">$${product.finalPrice.toFixed(2)}</span>
      </div>

      <div class="col-6 col-md-3 mt-2 mt-md-0">
        <div class="input-group" style="width:120px;">
          <button data-id=${product.id} class="minus-btn btn btn-outline-secondary" ${isDisabled}>−</button>
          <input  type="text" class="form-control text-center quantity-input" value="${element.quantity}" readonly>
          <button data-id=${product.id} class="plus-btn btn btn-outline-secondary">+</button>
        </div>
      </div>

      <div class="col-6 col-md-3 text-end mt-2 mt-md-0">
        <div class="fw-semibold">$${total}</div>
        <button data-id=${product.id} class="btn btn-sm text-danger delete-btn">
          <i class="fa fa-trash"></i>
        </button>
      </div>

    </div>
  </div>`;
}

let userId = userService.getCurrentUser()?.id;

/* Navbar / Footer */
$("body").prepend(navbar(getBasePath())).append(footer(getBasePath()));
initNavBar(getBasePath());
initFooter(getBasePath());

function updateCartCount() {
  const currentUser = userService.getCurrentUser();
  if (!currentUser) return;
  $("#cartCount").text(cartService.getCartCount(currentUser.id));
  $("#cartCountMobile").text(cartService.getCartCount(currentUser.id));
}
let cart;
/* Render Cart */
function renderCart() {
  cart = cartService.getCart(userId);
  updateCartCount();
  $("#mainCartWrapper").html("");

  if (!cart.items.length) {
    $("#mainCartWrapper").html(`
      <div class="text-center p-5 text-muted">
        <i class="fa fa-cart-shopping fa-2x mb-3"></i>
        <h5>Cart is empty</h5>
      </div>
    `);
    updateSummary(0);
    return;
  }

  let subtotal = 0;

  cart.items.forEach((item) => {
    let product = productService.getById(item.productId);
    subtotal += product.finalPrice * item.quantity;
    $("#mainCartWrapper").append(cartItem(product, item));
  });

  updateSummary(subtotal);
}

/* Summary */
function updateSummary(subtotal) {
  let tax = subtotal * 0.08;
  let total = subtotal + tax;

  $("#subtotal").text(`$${subtotal.toFixed(2)}`);
  $("#tax").text(`$${tax.toFixed(2)}`);
  $("#total").text(`$${total.toFixed(2)}`);
}

$(document).on("click", ".delete-btn", function () {
  let productId = $(this).attr("data-id");
  cartService.removeItem(userId, productId);
  renderCart();
});

$(document).on("click", ".minus-btn", function () {
  let productId = $(this).attr("data-id");
  cartService.addItem(userId, productId, -1);
  renderCart();
});

$(document).on("click", ".plus-btn", function () {
  let productId = $(this).attr("data-id");
  cartService.addItem(userId, productId);
  renderCart();
});

$(document).on("click", "#checkout", function () {
  if (!cart.items.length)
    initToast("Please Add Products to cart first!", "warning");
  else window.location.href = "../checkout/checkpage.html";
});

renderCart();
