import { userService } from "../../../DataBase/services/userService.js";
import { initLayout, initRoleButtons } from "./shared.js";
import {
  validateEmail,
  setError,
  setSuccess,
  clearErrors,
} from "./validation.js";
import { getBasePath } from "../../../assets/utils/basePath.js";

// ===== Initialize Layout =====
initLayout();

document.addEventListener("DOMContentLoaded", function () {
  initRoleButtons(".login-btn");

  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", handleLoginSubmit);

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    const targetId = btn.dataset.target;
    btn.addEventListener("click", () => {
      togglePassword(targetId, btn);
    });
  });
});

// ===== Handle Login =====
function handleLoginSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const emailField = form.email;
  const passwordField = form.password;
  const rememberCheckbox = form.remember;

  var remember = false;
  if (rememberCheckbox && rememberCheckbox.checked) {
    remember = true;
  }

  // ===== Determine Role =====
  var role = "customer";
  var activeRoleButton = form.querySelector(".login-btn.active");
  if (activeRoleButton) {
    role = activeRoleButton.dataset.role.toLowerCase();
  }

  clearErrors(form);

  // ===== Validation =====
  var isValid = true;

  if (!validateEmail(emailField.value)) {
    setError(emailField, "Enter a valid email address");
    isValid = false;
  } else {
    setSuccess(emailField);
  }

  if (!passwordField.value) {
    setError(passwordField, "Password is required");
    isValid = false;
  } else {
    setSuccess(passwordField);
  }

  if (!isValid) {
    return;
  }

  // ===== Check User Credentials =====
  var users = userService.getAll();

  var matchedUser = null;
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (
      user.email.toLowerCase() === emailField.value.trim().toLowerCase() &&
      atob(user.password).trim() === passwordField.value.trim()
    ) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    setError(emailField, "Invalid Email or Password");
    setError(passwordField, "Invalid Email or Password");
    return;
  }

  if (matchedUser.role.toLowerCase() !== role) {
    setError(
      emailField,
      'Role does not match. You registered as "' + matchedUser.role + '"',
    );
    setError(
      passwordField,
      'Role does not match. You registered as "' + matchedUser.role + '"',
    );
    return;
  }

  // ===== Set Current User =====
  userService.setCurrentUser(matchedUser, remember);

  // ===== Redirect Based on Role =====
  if (role === "admin") {
    window.location.href = getBasePath() + "/admin/dashboard.html";
  } else if (role === "vendor") {
    window.location.href = getBasePath() + "/seller/index.html";
  } else {
    window.location.href = getBasePath() + "/index.html";
  }
}
