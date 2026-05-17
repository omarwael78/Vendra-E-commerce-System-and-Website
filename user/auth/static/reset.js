import { userService } from "../../../DataBase/services/userService.js";
import { initLayout } from "./shared.js";
import { validateEmail, setError, clearErrors } from "./validation.js";

// ===== Initialize Layout =====
initLayout();

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", handleResetSubmit);

});

// ===== Handle Reset Form Submission =====
function handleResetSubmit(event) {

    event.preventDefault();

    const form = event.target;
    const emailField = form.email;

    clearErrors(form);

    // ===== Validate Email =====
    if (!validateEmail(emailField.value)) {
        setError(emailField, "Enter a valid email address");
        return;
    }

    // ===== Find User =====
    const users = userService.getAll();

    let matchedUser = null;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.email.toLowerCase() === emailField.value.trim().toLowerCase()) {
            matchedUser = user;
            break;
        }
    }

    if (!matchedUser) {
        setError(emailField, "Email not found");
        return;
    }

    // ===== Generate Temporary Password =====
    const tempPassword = generateTempPassword();

    // ===== Update User Password =====
    userService.update(matchedUser.id, { password: btoa(tempPassword) });

    alert(`Your temporary password: ${tempPassword}`);

    // ===== Redirect to Login =====
    window.location.href = "./login.html";

}

// ===== Generate Random 8-Character Password =====
function generateTempPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }

    return password;
}