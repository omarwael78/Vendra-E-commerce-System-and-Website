import { userService } from "../../../DataBase/services/userService.js";
import User from "../../../DataBase/models/User.js";

import {
    initLayout,
    initRoleButtons
} from "./shared.js";

import {
    validateUsername,
    validateEmail,
    validatePhone,
    validatePassword,
    setError,
    setSuccess,
    clearErrors
} from "./validation.js";

// ===== Layout Initialization =====
initLayout();

document.addEventListener("DOMContentLoaded", function () {

    initRoleButtons(".role-btn");

    var form = document.getElementById("registerForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", handleRegisterSubmit);
    document.querySelectorAll(".toggle-password").forEach((btn) => {
        const targetId = btn.dataset.target;
        btn.addEventListener("click", () => {
            togglePassword(targetId, btn);
        });
    });

});

// ===== Form Submission =====
function handleRegisterSubmit(event) {

    event.preventDefault();

    var form = event.target;

    // ===== Extract Fields =====
    var usernameField = form.username;
    var emailField = form.email;
    var phoneField = form.phone;
    var passwordField = form.password;
    var confirmPasswordField = form.confirm_password;

    var termsCheckbox = form.querySelector('input[type="checkbox"]');

    // ===== Determine Role =====
    var role;
    var activeRoleButton = form.querySelector(".role-btn.active");
    if (activeRoleButton) {
        role = activeRoleButton.dataset.role;
    } else {
        role = "customer";
    }

    clearErrors(form);

    // ===== Validation =====
    var isValid = true;

    // Username
    if (!validateUsername(usernameField.value)) {
        setError(usernameField, "Invalid username");
        isValid = false;
    } else {
        setSuccess(usernameField);
    }

    // Email
    if (!validateEmail(emailField.value)) {
        setError(emailField, "Invalid email");
        isValid = false;
    } else {
        setSuccess(emailField);
    }

    // Phone
    if (!validatePhone(phoneField.value)) {
        setError(phoneField, "Invalid phone number");
        isValid = false;
    } else {
        setSuccess(phoneField);
    }

    // Password
    if (!validatePassword(passwordField.value)) {
        setError(passwordField, "Weak password");
        isValid = false;
    } else {
        setSuccess(passwordField);
    }

    // Confirm Password
    if (
        confirmPasswordField.value !== passwordField.value ||
        !validatePassword(passwordField.value)
    ) {
        setError(confirmPasswordField, "Passwords do not match");
        isValid = false;
    } else {
        setSuccess(confirmPasswordField);
    }

    // Terms
    if (!termsCheckbox.checked) {
        setError(termsCheckbox, "You must accept the terms");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // ===== Email Uniqueness Check =====
    if (userService.emailExists(emailField.value)) {
        setError(emailField, "Email already exists");
        return;
    }

    // ===== Create User =====
    var newUser = new User({
        name: usernameField.value,
        email: emailField.value,
        phone: phoneField.value,
        password: passwordField.value,
        role: role,
        address: ""
    });

    userService.create(newUser);

    // ===== Redirect to Login =====
    window.location.href = "./login.html";

}