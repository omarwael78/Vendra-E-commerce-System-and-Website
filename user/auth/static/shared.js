import { navbar, initNavBar } from "../../../components/user/navbar.js";
import { footer, initFooter } from "../../../components/user/footer.js";
import { getBasePath } from "../../../assets/utils/basePath.js";
import { cartService } from "../../../DataBase/services/cartService.js";
import { userService } from "../../../DataBase/services/userService.js";

export function initLayout() {
  function updateCartCount() {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) return;
    $("#cartCount").text(cartService.getCartCount(currentUser.id));
    $("#cartCountMobile").text(cartService.getCartCount(currentUser.id));
  }

  $(function () {
    if ($("#container").length) {
      $("#container")
        .prepend(navbar(getBasePath()))
        .append(footer(getBasePath()));
      initNavBar(getBasePath());
      initFooter(getBasePath());
      updateCartCount();
    }

    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.role === "admin") {
      userService.deleteCurrentUser();
      location.reload();
    }
  });
}

export function initRoleButtons(selector) {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", function () {
      const group = this.parentElement.querySelectorAll(".btn");
      group.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

export function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;

  const icon = btn?.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon?.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon?.classList.replace("fa-eye-slash", "fa-eye");
  }
}

window.togglePassword = togglePassword;