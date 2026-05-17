import { userService } from "../../DataBase/services/userService.js";
import { validatePassword } from "../../user/auth/static/validation.js";
export function initUsersBoard() {
  displayUsers();
  function displayUsers() {
    let currentUser = userService.getCurrentUser();
    let allUsers = userService.getAll();
    let users = allUsers.filter((u) => u.id !== currentUser?.id);
    $("#usersTableBody").empty();
    // Render Users
    users.forEach((user) => {
      const userRow = `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="bg-primary-subtle text-${user.colorTheme} rounded-circle p-2 me-2 fw-bold" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">${user.name.slice(0, 1)}</div>
                                ${user.name}
                            </div>
                        </td>
                        <td><span class="badge border text-body" >${user.role}</span></td>
                        <td>${new Date(user.createdAt).toLocaleDateString("en-CA")}</td>
                        <td class="text-end">
                            <button data-id=${user.id}  class="btn btn-sm btn-outline-primary me-1 update-user-role"><i class="fas fa-edit"></i></button>
                            <button data-id=${user.id}  class="btn btn-sm btn-outline-danger delete-user"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
      $("#usersTableBody").append(userRow);
    });
  }

  let userId = null;

  $(document).on("click", ".delete-user", function () {
    userId = $(this).attr("data-id");
    const modalEl = document.getElementById("confirmModal");

    modalEl.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

        <div class="modal-header">
        <h5 class="modal-title">Confirm Action</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
        Are you sure you want to delete this item?
        </div>

        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
        </button>
        <button type="button" id="confirmDeleteBtn" class="btn btn-danger">
            Yes, Delete
        </button>
        </div>

    </div>
    </div>
    `;

    const modal = new bootstrap.Modal(modalEl);

    modal.show();
  });

  $(document).on("click", "#confirmDeleteBtn", function () {
    if (!userId) return;

    userService.delete(userId);

    const modalEl = document.getElementById("confirmModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    displayUsers();
    modalInstance.hide();
  });

  $(document).on("click", ".update-user-role", function () {
    userId = $(this).attr("data-id");
    const modalEl = document.getElementById("confirmModal");

    modalEl.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

        <div class="modal-header">
        <h5 class="modal-title">Change User Role</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        
        <div class="modal-body">
            <div class="mb-3">
                <label for="selectedRole" class="form-label">User Role</label>
                <select class="form-select" id="selectedRole">
                    <option value="admin">Admin</option>
                    <option value="vendor">Vendor</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            
            <div class="mb-3">
                <label for="userPassword" class="form-label">Password</label>
                <div class="input-group">
                    <input type="password" class="form-control" id="userPassword" placeholder="Enter new password">
                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                       <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <div id="passwordError" class="invalid-feedback  "></div>
                <small class="text-muted">Leave blank to keep current password</small>
            </div>
        </div>

        <div class="modal-footer">
        <button type="button" id="confirmChangeRole" class="btn btn-primary">
        Save Changes
        </button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
        </button>
        </div>

    </div>
    </div>
    `;

    // Add password toggle functionality
    setTimeout(() => {
      const togglePassword = document.getElementById("togglePassword");
      const passwordInput = document.getElementById("userPassword");

      if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
          const type =
            passwordInput.getAttribute("type") === "password"
              ? "text"
              : "password";
          passwordInput.setAttribute("type", type);
          this.innerHTML =
            type === "password"
              ? ' <i class="fa-solid fa-eye"></i>'
              : '<i class="fa-solid fa-eye-slash"></i>';
        });
      }
    }, 100);

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  });

  $(document).on("click", "#confirmChangeRole", function () {
    if (!userId) return;

    let userPassword = $("#userPassword").val();
    const errorDiv = document.getElementById("passwordError");
    const passwordInput = document.getElementById("userPassword");

    // Validate password if not empty
    if (userPassword !== "") {
      if (!validatePassword(userPassword)) {
        // Show error message
        errorDiv.classList.add("d-inline-block");
        errorDiv.textContent =
          "Password must be at least 8 characters and contain both letters and numbers";
        passwordInput.classList.add("is-invalid");
        return; // Stop if password validation fails
      }
    }

    // Clear any previous error states
    errorDiv.classList.add("d-none");
    passwordInput.classList.remove("is-invalid");

    let targetUser = userService.getById(userId);
    let newRole = $("#selectedRole").val();

    if (!(targetUser.role === newRole)) targetUser.role = newRole;
    if (!(userPassword == "")) targetUser.password = btoa(userPassword);

    userService.update(userId, targetUser);
    const modalEl = document.getElementById("confirmModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    displayUsers();
    modalInstance.hide();
  });
}
