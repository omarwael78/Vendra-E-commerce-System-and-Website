import { initLayout } from "./shared.js";
import { getBasePath } from "../../../assets/utils/basePath.js";
import { userService } from "../../../DataBase/services/userService.js";
import { cartService } from "../../../DataBase/services/cartService.js";
import { orderService } from "../../../DataBase/services/orderService.js";

// ===== Initialize Layout =====
initLayout();

document.addEventListener("DOMContentLoaded", function () {
  const profileForm = document.getElementById("profileForm");
  if (!profileForm) return;

  let currentUser = userService.getCurrentUser();

  // ===== Redirect if not logged in =====
  if (!currentUser) {
    window.location.href = "./login.html";
    return;
  }

  // ===== RENDER PROFILE INFO =====
  function renderProfile(user) {
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profilePhone").textContent =
      user.phone || "No phone";

    const locationParts = [
      user.address,
      user.city,
      user.state,
      user.zipcode,
    ].filter(Boolean);

    document.getElementById("profileLocation").textContent =
      locationParts.length ? locationParts.join(", ") : "No location set";

    document.getElementById("profileJoinDate").textContent = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A";

    document.getElementById("profileAvatar").src =
      user.image || "../../assets/images/no_image.png";
  }

  renderProfile(currentUser);

  // ===== SHOPPING SUMMARY =====
  let userOrders = orderService.getByUser(currentUser.id) || [];
  const userCartCount = cartService.getCartCount(currentUser.id) || 0;

  document.getElementById("cartCount").textContent = userCartCount;

  // ===== RENDER ORDERS LIST =====
  const ordersList = document.getElementById("ordersList");
  const ordersCountEl = document.getElementById("ordersCount");

  function getStatusColor(status) {
    status = status.toLowerCase();
    if (status === "pending") return "warning";
    else if (status === "shipped") return "info";
    else if (status === "delivered") return "success";
    else if (status === "cancelled") return "danger";
    else return "secondary";
  }

  function renderOrders() {
    ordersList.innerHTML = "";

    if (userOrders.length === 0) {
      ordersList.innerHTML = "<p class='text-muted'>You have no orders.</p>";
      ordersCountEl.textContent = 0;
      return;
    }

    ordersCountEl.textContent = userOrders.filter(function (o) {
      return o.status !== "cancelled";
    }).length;

    userOrders.forEach(function (order) {
      const total = order.items
        ? order.items.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
          }, 0)
        : 0;

      let itemsHtml = "";
      if (order.items && order.items.length > 0) {
        itemsHtml = order.items
          .map(function (item) {
            return `
                    <div class="d-flex justify-content-between">
                        <span>${item.productTitle} x ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)} USD</span>
                    </div>
                    `;
          })
          .join("");
      } else {
        itemsHtml = "<p class='text-muted'>No products</p>";
      }

      const orderHtml = document.createElement("div");
      orderHtml.className = "border rounded p-3 mb-3";
      orderHtml.innerHTML = `
                <div class="d-flex justify-content-between">
                    <strong>Order #${order.id.slice(0, 8)}</strong>
                    <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                </div>
                <div class="mt-2 mb-2">${itemsHtml}</div>
                <div class="mt-2">
                    <strong>Total: ${total.toFixed(2)} USD</strong>
                </div>
            `;

      if (order.status === "pending") {
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn btn-sm btn-danger mt-2";
        cancelBtn.textContent = "Cancel Order";
        cancelBtn.addEventListener("click", function () {
          orderService.updateStatus(order.id, "cancelled");
          order.status = "cancelled";

          const badge = orderHtml.querySelector(".badge");
          badge.textContent = "cancelled";
          badge.className = "badge bg-danger";

          cancelBtn.remove();
          ordersCountEl.textContent = userOrders.filter(function (o) {
            return o.status !== "cancelled";
          }).length;
        });
        orderHtml.appendChild(cancelBtn);
      }

      if (order.status.toLowerCase() === "shipped") {
        const deliveredBtn = document.createElement("button");
        deliveredBtn.className = "btn btn-sm btn-success mt-2";
        deliveredBtn.textContent = "Delivered";

        deliveredBtn.addEventListener("click", function () {
          orderService.updateStatus(order.id, "delivered");
          order.status = "delivered";

          const badge = orderHtml.querySelector(".badge");
          badge.textContent = "delivered";
          badge.className = "badge bg-success";

          deliveredBtn.remove();
          ordersCountEl.textContent = userOrders.filter(function (o) {
            return o.status !== "cancelled";
          }).length;
        });

        orderHtml.appendChild(deliveredBtn);
      }

      ordersList.appendChild(orderHtml);
    });
  }

  renderOrders();

  // ===== PREFILL EDIT PROFILE FORM =====
  profileForm.name.value = currentUser.name || "";
  profileForm.email.value = currentUser.email || "";
  profileForm.phone.value = currentUser.phone || "";
  profileForm.address.value = currentUser.address || "";
  profileForm.city.value = currentUser.city || "";
  profileForm.state.value = currentUser.state || "";
  profileForm.zipcode.value = currentUser.zipcode || "";

  const imageInput = profileForm.image;
  const imagePreview = document.getElementById("imagePreview");

  if (currentUser.image) {
    imagePreview.src = currentUser.image;
    imagePreview.style.display = "block";
  }

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  // ===== SAVE PROFILE CHANGES =====
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      name: profileForm.name.value.trim(),
      email: profileForm.email.value.trim(),
      phone: profileForm.phone.value.trim(),
      address: profileForm.address.value.trim(),
      city: profileForm.city.value.trim(),
      state: profileForm.state.value.trim(),
      zipcode: profileForm.zipcode.value.trim(),
    };

    function saveProfile() {
      userService.update(currentUser.id, updatedData);
      currentUser = userService.getById(currentUser.id);
      const isRemembered = localStorage.getItem("currentUser") !== null;
      userService.setCurrentUser(currentUser, isRemembered);

      renderProfile(currentUser);

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editProfileModal"),
      );
      modal.hide();
    }

    if (imageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        updatedData.image = e.target.result;
        saveProfile();
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      saveProfile();
    }
  });

  // ===== DELETE ACCOUNT =====
  const deleteBtn = document.getElementById("deleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const confirmModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal"),
  );

  deleteBtn.addEventListener("click", function () {
    confirmModal.show();
  });

  confirmDeleteBtn.addEventListener("click", function () {
    userService.delete(currentUser.id);
    window.location.href = "./login.html";
  });
});
