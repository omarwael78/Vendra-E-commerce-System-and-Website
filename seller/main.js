import { overviewPage } from "./components/overveiw.js";
import { productsPage } from "./components/products.js";
import { analyticsPage } from "./components/analytics.js";
import { ordersPage } from "./components/orders.js";

import { userService } from "../DataBase/services/userService.js";
import { productService } from "../DataBase/services/productService.js";
import { orderService } from "../DataBase/services/orderService.js";

$(document).ready(function () {
  let user = userService.getCurrentUser();
  if (user && user.role !== "vendor") {
    userService.deleteCurrentUser();
    window.location.href = "../user/auth/login.html";
  }
  $("#sellerName").text(user.name);

  loadPage("overview");

  $(document).on("click", ".sidebar-nav li", function () {
    const page = $(this).data("page");
    handleNavigation(page);
  });

  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-bs-theme", savedTheme);
});

function handleNavigation(page) {
  switch (page) {
    case "overview":
      loadPage("overview");
      break;

    case "products":
      loadPage("products");
      break;

    case "orders":
      loadPage("orders");
      break;

    case "analytics":
      loadPage("analytics");
      break;

    case "back":
      userService.deleteCurrentUser();
      window.location.href = "../index.html";
      return;
  }

  $(".sidebar-nav li").removeClass("active");
  $(`.sidebar-nav li[data-page="${page}"]`).addClass("active");

  const offcanvasEl = document.getElementById("mobileSidebar");
  if (offcanvasEl && offcanvasEl.classList.contains("show")) {
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    offcanvas.hide();
  }
}

function loadPage(page) {
  let currentUser = userService.getCurrentUser().id;
  let userProducts = productService.getByVendor(currentUser);
  let userOrders = orderService.getByVendor(currentUser);
  switch (page) {
    case "overview":
      $("#content").html(overviewPage(userProducts, userOrders));
      $("#pageTitle").text("Overview");
      loadCharts();
      break;

    case "products":
      $("#content").html(productsPage());
      $("#pageTitle").text("Products");
      break;

    case "orders":
      $("#content").html(ordersPage());
      $("#pageTitle").text("Orders");
      break;

    case "analytics":
      $("#content").html(analyticsPage());
      $("#pageTitle").text("Analytics");
      loadAnalyticsCharts();
      break;
  }
}

function loadCharts() {
  const salesCtx = document.getElementById("salesChart");
  const revenueCtx = document.getElementById("revenueChart");

  if (!salesCtx || !revenueCtx) return;

  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sales",
          data: [4200, 3800, 5000, 4600, 6200, 7100],
          borderWidth: 2,
        },
      ],
    },
  });

  new Chart(revenueCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [4200, 3800, 5000, 4600, 6200, 7100],
          borderWidth: 1,
        },
      ],
    },
  });
}

function loadAnalyticsCharts() {
  const salesCtx = document.getElementById("analyticsSalesChart");
  const statusCtx = document.getElementById("ordersStatusChart");

  if (!salesCtx || !statusCtx) return;

  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Sales",
          data: [8200, 10400, 9600, 12100],
          borderWidth: 2,
        },
      ],
    },
  });

  new Chart(statusCtx, {
    type: "doughnut",
    data: {
      labels: ["Delivered", "shipped", "Pending", "Cancelled"],
      datasets: [
        {
          data: [65, 25, 10,60],
          borderWidth: 1,
        },
      ],
    },
  });
}
