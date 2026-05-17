//app.js
import { initNavigation } from "./navigation.js";
import { initCharts } from "./charts.js";

import { overview, initOverview } from "../components/overview.js";
import { initUsersBoard } from "../components/usersBoard.js";
import { initProductsBoard } from "../components/productsBoard.js";
import { initOrdersBoard } from "../components/ordersBoard.js";
import { userService } from "../../DataBase/services/userService.js";

$("#wrapper").prepend(overview);
initOverview();
initUsersBoard();
initProductsBoard();
initOrdersBoard();
$(document).ready(function () {
  let user = userService.getCurrentUser();
  if (user && user.role !== "admin") {
    userService.deleteCurrentUser();
    window.location.href = "../user/auth/login.html";
  }
  initNavigation();
  initCharts();

  //change color mode
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-bs-theme", savedTheme);

  //logout
  $(document).on("click", "#logOut", function () {
    userService.deleteCurrentUser();
    window.location.href = "../index.html";
  });
});
