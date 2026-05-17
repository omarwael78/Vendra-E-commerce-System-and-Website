import { productService } from "../../DataBase/services/productService.js";

const overviewData = {
  stats: [
    {
      id: 'total-users',
      label: 'Total Users',
      value: '12,845',
      change: '15.3%',
      changeType: 'positive',
      icon: 'fas fa-user-friends',
      iconBgClass: 'bg-primary bg-opacity-10',
      iconTextClass: 'text-primary'
    },
    {
      id: 'active-sellers',
      label: 'Active Sellers',
      value: '1632',
      change: '+ 10% this month',
      changeType: 'positive',
      icon: 'fa-solid fa-bag-shopping',
      iconBgClass: 'bg-success bg-opacity-10',
      iconTextClass: 'text-success'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: '$363.2K',
      change: '22.4%',
      changeType: 'positive',
      icon: 'fas fa-dollar-sign',
      iconBgClass: 'bg-success bg-opacity-10',
      iconTextClass: 'text-success'
    }
  ],
  pendingCount: 0,
  pendingProducts: [] 
};

export function overview() {
  const { stats, pendingCount } = overviewData;

  return `
    <div id="overview-page" class="page-section active-section">
      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="deleteConfirmModalLabel">
                <i class="fas fa-exclamation-triangle me-2"></i>Confirm Delete
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" ></button>
            </div>
            <div class="modal-body text-center py-4">
              <i class="fas fa-trash-alt fa-3x text-danger mb-3"></i>
              <h5>Are you sure you want to delete this product?</h5>
              <p class="text-muted mb-0">Product: <strong id="delete-product-name"></strong></p>
              <small class="text-danger">This action cannot be undone!</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
              <button type="button" id="confirmDeleteBtn" class="btn btn-danger">
                <i class="fas fa-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        ${stats.map(stat => `
          <div class="col-md-4">
            <div class="stat-card shadow-lg d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted small mb-1">${stat.label}</p>
                <h4 class="fw-bold mb-1">${stat.value}</h4>
                <small class="text-success fw-bold"><i class="fas fa-arrow-up"></i> ${stat.change}</small>
              </div>
              <div class="stat-icon ${stat.iconBgClass} ${stat.iconTextClass}">
                <i class="${stat.icon}"></i>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="row g-3 mb-4">
        <div class="col-lg-6 shadow-lg">
          <div class="card-container">
            <h6 class="fw-bold mb-3"><i class="fas fa-chart-bar me-2 text-muted"></i>Platform Revenue (Monthly)</h6>
            <canvas id="revenueBarChart"></canvas>
          </div>
        </div>
        <div class="col-lg-6 shadow-lg">
          <div class="card-container">
            <h6 class="fw-bold mb-3"><i class="fas fa-chart-pie me-2 text-muted"></i>Sales by Category</h6>
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
      </div>

      <div class="card-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0">Pending Product Approvals</h6>
          <span id="pending-count" class="badge bg-danger rounded-pill"><span id="pendingNumber">${pendingCount}</span> Pending</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0" style="font-size:0.7rem">
            <thead class="table">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Date</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody id="pending-products-list">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initOverview() {
  let productToDelete = null;
  function approveProducts() {
    let products = productService.getAll();
    let pendingProducts = products.filter((p) => p.approved === false);
    $("#pendingNumber").text(pendingProducts.length);
    $("#pending-products-list").empty();
    pendingProducts.forEach((element) => {
      $("#pending-products-list").append(
        `
          <tr>
            <td>${element.title}</td>
            <td>${element.category}</td>
            <td>${element.price} $</td>
            <td>${new Date(element.createdAt).toISOString().split("T")[0]}</td>
            <td class="text-center">
              <button data-id="${element.id}" data-name="${element.title}" class="approve-btn btn btn-action border-success bg-body text-success"><i class="fas fa-check"></i></button>
              <button data-id="${element.id}" data-name="${element.title}" class="delete-btn btn-action btn bg-body border-danger text-danger"><i class="fas fa-times"></i></button>
            </td>
          </tr>
        `,
      );
    });
  }
  
  approveProducts();
  
  $(document).on("click", ".approve-btn", function () {
    const productId = $(this).data("id");
    productService.approve(productId);
    approveProducts();
  });

  $(document).on("click", ".delete-btn", function () {
    productToDelete = $(this).data("id");
    const productName = $(this).data("name");
    
    $("#delete-product-name").text(productName);
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    deleteModal.show();
  });

  $(document).on("click", "#confirmDeleteBtn", function () {
    if (productToDelete) {
      productService.remove(productToDelete);
      productToDelete = null;
      
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
      deleteModal.hide();
      approveProducts();
    }
  });
}