export function validateUsername(username) {
  if (!username || username.trim().length < 3) return false;
  if (/^\d+$/.test(username.trim())) return false;
  return true;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^(010|011|012|015)[0-9]{8}$/.test(phone);
}

export function validatePassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export function setError(input, message) {
  const parent =
    input.closest(".input-group, .form-check") || input.parentElement;

  let feedback = parent.querySelector(".invalid-feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    parent.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.style.display = "block";

  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

export function setSuccess(input) {
  const parent =
    input.closest(".input-group, .form-check") || input.parentElement;

  let feedback = parent.querySelector(".valid-feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "valid-feedback";
    parent.appendChild(feedback);
  }

  feedback.textContent = "";
  feedback.style.display = "none";

  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

export function clearErrors(form) {
  form.querySelectorAll(".is-invalid").forEach((el) =>
    el.classList.remove("is-invalid")
  );

  form.querySelectorAll(".is-valid").forEach((el) =>
    el.classList.remove("is-valid")
  );

  form.querySelectorAll(".invalid-feedback").forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });

  form.querySelectorAll(".valid-feedback").forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });
}