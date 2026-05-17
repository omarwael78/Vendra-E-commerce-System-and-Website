import { getBasePath } from "../../assets/utils/basePath.js";
import { navbar, initNavBar } from "../../components/user/navbar.js";
import { footer, initFooter } from "../../components/user/footer.js";

import { userService } from "../../DataBase/services/userService.js";
import { cartService } from "../../DataBase/services/cartService.js";
import Order from "../../DataBase/models/Order.js";
import { productService } from "../../DataBase/services/productService.js";
import { orderService } from "../../DataBase/services/orderService.js";
import { userDetails } from "./userDetails.js";
import { initToast } from "../../utils/toast.js";

let currentUser = userService.getCurrentUser()?.id;
$(document).ready(function () {
  const basePath = getBasePath();

  $("body").prepend(navbar(basePath)).append(footer(basePath));
  initNavBar(basePath);
  initFooter();
  function updateCartCount() {
    if (!currentUser) return;
    $("#cartCount").text(cartService.getCartCount(currentUser));
    $("#cartCountMobile").text(cartService.getCartCount(currentUser));
  }
  updateCartCount();

  //insert user details
  let user = userService.getCurrentUser();
  $("#checkoutForm").prepend(userDetails(user));

  let userCart = cartService.getCart(currentUser);
  let productsDB = productService.getAll();

  const order = new Order(currentUser, userCart.items, productsDB);

  function drawSummary() {
    let html = "";
    order.items.forEach((item) => {
      let product = productService.getById(item.productId);
      html += `
                <div class="d-flex align-items-center mb-3">
                    <img src="${product.images[0]}" class="product-img me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-truncate-2 fw-bold">${product.title}</h6>
                        <small class="text-muted">Qty: ${item.quantity}</small>
                    </div>
                    <div class="fw-medium ms-2">$${item.total.toFixed(2)}</div>
                </div>`;
    });

    let taxAmount = order.totalPrice * 0.08;
    let total = taxAmount + order.totalPrice;
    $("#orderItemsContainer").html(html);
    $("#subtotal").text(`$${order.totalPrice.toFixed(2)}`);
    $("#shipping").text("FREE");
    $("#tax").text(`$${taxAmount.toFixed(2)}`);
    $("#totalPrice").text(`$${total.toFixed(2)}`);
  }
  drawSummary();

  // (Regex Patterns)
  const patterns = {
    fullName: /^[a-zA-Z\s]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[0-9]{10,15}$/,
    address: /^[a-zA-Z0-9\s,.'-]{10,}$/,
    city: /^[a-zA-Z\s]{2,30}$/,
    state: /^[a-zA-Z\s]{2,20}$/,
    zipCode: /^\d{5,10}$/,
    cardNumber: /^\d{16}$/,
    cardName: /^[a-zA-Z\s]{3,50}$/,
    expiryDate: /^(0[1-9]|1[0-2])\/?([2-9][0-9])$/,
    cvv: /^\d{3,4}$/,
  };

  function validateField(id, pattern, errorMsg) {
    const $field = $(`#${id}`);
    const value = $field.val().trim();
    const isValid = pattern.test(value);

    $field.removeClass("is-invalid is-valid");
    $field.next(".invalid-feedback").remove();

    if (!isValid) {
      $field.addClass("is-invalid");
      $field.after(`<div class="invalid-feedback">${errorMsg}</div>`);
      return false;
    } else {
      $field.addClass("is-valid");
      return true;
    }
  }

  $("#placeOrderBtn").on("click", function () {
    let isAllValid = true;

    $(".invalid-feedback").remove();
    $(".form-control, .form-select").removeClass("is-invalid is-valid");

    isAllValid &= validateField(
      "fullName",
      patterns.fullName,
      "Please enter a valid name (letters only, min 3).",
    );
    isAllValid &= validateField(
      "email",
      patterns.email,
      "Please enter a valid email address.",
    );
    isAllValid &= validateField(
      "phone",
      patterns.phone,
      "Enter a valid phone number (10-15 digits).",
    );
    isAllValid &= validateField(
      "address",
      patterns.address,
      "Address must be at least 10 chars (letters/numbers).",
    );
    isAllValid &= validateField(
      "city",
      patterns.city,
      "Valid city name required.",
    );
    isAllValid &= validateField(
      "state",
      patterns.state,
      "Valid state name required.",
    );
    isAllValid &= validateField(
      "zipCode",
      patterns.zipCode,
      "ZIP code must be 5-10 digits.",
    );

    if (!$("#country").val()) {
      $("#country")
        .addClass("is-invalid")
        .after('<div class="invalid-feedback">Please select a country.</div>');
      isAllValid = false;
    } else {
      $("#country").addClass("is-valid");
    }

    let cleanCard = $("#cardNumber").val().replace(/\s/g, "");
    if (!patterns.cardNumber.test(cleanCard)) {
      $("#cardNumber")
        .addClass("is-invalid")
        .after('<div class="invalid-feedback">Card must be 16 digits.</div>');
      isAllValid = false;
    } else {
      $("#cardNumber").addClass("is-valid");
    }

    isAllValid &= validateField(
      "cardName",
      patterns.cardName,
      "Name on card must be letters only.",
    );
    isAllValid &= validateField(
      "expiryDate",
      patterns.expiryDate,
      "Use MM/YY format.",
    );
    isAllValid &= validateField(
      "cvv",
      patterns.cvv,
      "CVV must be 3 or 4 digits.",
    );

    if (isAllValid) {
      const finalData = {
        customer: {
          name: $("#fullName").val(),
          email: $("#email").val(),
          phone: $("#phone").val(),
        },
        shipping: {
          address: $("#address").val(),
          city: $("#city").val(),
          country: $("#country").val(),
        },
        payment: { cardNum: cleanCard, expiry: $("#expiryDate").val() },
        order: order,
        timestamp: new Date().toISOString(),
      };
      const availableQuantity = orderService.updateStock(order);
      if (availableQuantity) {
        console.log("SUCCESS:", finalData);

        orderService.create(order);
        console.log("✅ Order Created:", order.id);

        cartService.clearCart(currentUser);
        window.location.href = "../../index.html";
        alert("Order placed successfully!");
      } else {
        initToast(`This items is out of stock for this quantity  `, "warning");
      }
    } else {
      $("html, body").animate(
        {
          scrollTop: $(".is-invalid").first().offset().top - 120,
        },
        500,
      );
    }
  });

  $("#cardNumber").on("input", function () {
    let v = $(this)
      .val()
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "");
    let parts = v.match(/.{1,4}/g);
    $(this).val(parts ? parts.join(" ") : "");
  });
});
