import { productService } from "../../DataBase/services/productService.js";
import { userService } from "../../DataBase/services/userService.js";
import Product from "../../DataBase/models/Product.js";
import { initToast } from "../../utils/toast.js";

export function productsPage() {
  let vendorId = userService.getCurrentUser().id;
  let editingProductId = null;
  $(document).off("click", ".add-product");
  $(document).off("click", ".edit-btn");
  $(document).off("click", "#saveProduct");
  $(document).off("click", ".delete-btn");
  $(document).on("click", ".add-product", function () {
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  });

  $(document).on("click", ".edit-btn", function () {
    editingProductId = $(this).attr("data-productId");
    let product = productService.getById(editingProductId);
    $("#productEditModal").remove();
    $(".products-container").prepend(editModal(product));
    const modal = new bootstrap.Modal(
      document.getElementById("productEditModal"),
    );

    modal.show();
  });
  $(document).on("click", "#saveEditProduct", function () {
    const form = document.getElementById("ediProductForm");

    if (!form.checkValidity()) {
      form.reportValidity();
      initToast("Please fill all required fields correctly.", "danger");
      return;
    }
initToast("Product updated successfully.", "success");
    let formData = new FormData(form);
    let updatedProduct = Object.fromEntries(formData.entries());
    const { image, ...rest } = updatedProduct;

    let editProduct = {
      approved: false,
      ...rest,
      vendorId,
      images: image ? [image] : [],
    };
    productService.updateProduct(editingProductId, editProduct);

    bootstrap.Modal.getInstance(
      document.getElementById("productEditModal"),
    ).hide();

    form.reset();
    renderProducts();
  });

  $(function () {
    renderProducts();
  });

  function renderProducts() {
    $("table tbody").text("");
    let products = productService.getByVendor(vendorId);
    products.forEach((element) => {
      $("table tbody").append(`
              <tr class="bg-${element.approved ? `success` : `warning`} bg-opacity-25">
                <td class="text-truncate bg-transparent" style="max-width:180px">${element.desc}</td>
                 
                <td class="bg-transparent">${element.category}</td>
                <td class="bg-transparent">${element.price} $</td>
                <td class="bg-transparent">${element.discount} %</td>
                <td class="bg-transparent">${element.rating}</td>
                <td class="bg-transparent">${element.stock}</td>
                <td class="bg-transparent">${element.weight}</td>
                <td class="bg-transparent">
                  <img src="${element.images[0]}" width="50" class="rounded">
                </td>
                <td class="bg-transparent text-nowrap action">
                  <i data-productId=${element.id} class="fas fa-edit text-success me-2 edit-btn"></i>
                  <i data-productId=${element.id} class="fas fa-trash text-danger delete-btn"></i>
                </td>
              </tr>
            `);
    });
  }

  $(document).on("click", "#saveProduct", function () {
    if (!$("#productForm")[0].checkValidity()) {
      initToast("Please fill all required fields correctly.", "danger");
      $("#productForm")[0].reportValidity();
      return;
    }

    let title = $("#title").val();
    let desc = $("#desc").val();
    let category = $("#category").val();
    let price = $("#price").val();
    let discount = $("#discount").val();
    let stock = $("#stock").val();
    let weight = $("#weight").val();
    let image = $("#image").val();
    initToast("Product added successfully.", "success");
    const product = new Product({
      vendorId: vendorId,
      title: title,
      desc: desc,
      category: category,
      price: price,
      discount: discount,
      stock: stock,
      images: image ? [image] : [],
      weight: weight,
    });

    productService.create(product);

    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    $("#productForm")[0].reset();
    renderProducts();
  });

  let productId;

  $(document).on("click", ".delete-btn", function () {
    productId = $(this).attr("data-productId");
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
    if (!productId) return;

    productService.remove(productId);
    renderProducts();

    const modalEl = document.getElementById("confirmModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  });

  return `
          <div class="container-fluid products-container">
        
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h3 class="mb-0">Products</h3>
              <button class="btn btn-primary add-product">
                <i class="fas fa-plus"></i> Add Product
              </button>
            </div>
        
            <div class="card shadow-sm p-3">
        
              <!--  Responsive Table Wrapper -->
              <div class="table-responsive-lg">
                <table class="table align-middle table-nowrap">
                  <thead class="table">
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Rating</th>
                      <th>Stock</th>
                      <th>Weight</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
        
            </div>
        
            <!-- Modal -->
            <div class="modal fade" id="productModal" tabindex="-1">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
        
                  <div class="modal-header">
                    <h5 class="modal-title">Add Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
        
                  <div class="modal-body">
                    <form id="productForm">
                      <div class="row g-3">
        
                        <div class="col-md-6">
                          <label>Title*</label>
                          <input  type="text" class="form-control" id="title" required>
                        </div>
                        
                        <div class="col-md-6">
                          <label>Category*</label>
                          <input type="text" class="form-control" id="category" required>
                        </div>
        
                        <div class="col-md-4">
                          <label>Price*</label>
                          <input type="number" class="form-control" id="price" required min="0" step="0.01">
                        </div>
                        
                        <div class="col-md-4">
                        <label>Stock*</label>
                        <input type="number" class="form-control" id="stock" required min="0" step="1">
                        </div>
                        
                        <div class="col-md-4">
                        <label>Discount</label>
                        <input type="number" class="form-control" id="discount" min="0" max="100" step="0.01" required>
                        </div>
                        
                        <div class="col-md-8">
                          <label>Description</label>
                          <input type="text" class="form-control" id="desc" required>
                        </div>
                        
                        <div class="col-md-4">
                          <label>Weight</label>
                          <input type="number" class="form-control" id="weight" required min="0" step="0.01">
                        </div>
        
                        <div class="col-md-12">
                          <label>Image URL</label>
                          <input type="text" class="form-control" id="image" required>
                        </div>
        
                      </div>
                    </form>
                  </div>
        
                  <div class="modal-footer">
                    <button  type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary" id="saveProduct">Save</button>
                  </div>
        
                </div>
              </div>
            </div>
        
          </div>
          `;
}

function editModal(product) {
  return `   <!-- Modal -->
            <div class="modal fade" id="productEditModal" tabindex="-1">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
        
                  <div class="modal-header">
                    <h5 class="modal-title">Add Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
        
                  <div class="modal-body">
                    <form id="ediProductForm">
                      <div class="row g-3">
        
                        <div class="col-md-6">
                          <label>Title*</label>
                          <input type="text" class="form-control" value = "${product.title}" name="title" required>
                        </div>
                        
                        <div class="col-md-6">
                          <label>Category*</label>
                          <input type="text" class="form-control" value = "${product.category}" name = "category" required>
                        </div>
        
                        <div class="col-md-4">
                          <label>Price*</label>
                          <input type="number" class="form-control" value = ${product.price} name = "price" step="0.01" required min="0">
                        </div>
                        
                        <div class="col-md-4">
                        <label>Stock*</label>
                        <input type="number" class="form-control" value = ${product.stock} name = "stock" required min="0" step="1">
                        </div>
                        
                        <div class="col-md-4">
                        <label>Discount</label>
                        <input type="number" class="form-control" value = ${product.discount}  name = "discount" step="0.01" required min="0" max="100">
                        </div>
                        
                        <div class="col-md-8">
                          <label>Description</label>
                          <textarea type="text" class="form-control" rows = "3" name = "desc" required>${product.desc}</textarea>
                        </div>
                        
                        <div class="col-md-4">
                          <label>Weight</label>
                          <input type="number" class="form-control" value = ${product.weight} name = "weight" required min="0" step="0.01">
                        </div>
        
                        <div class="col-md-12">
                          <label>Image URL</label>
                          <input type="text" class="form-control" value = "${product.images[0]}"  name = "image" required>
                        </div>
        
                      </div>
                    </form>
                  </div>
        
                  <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button  type="submit" class="btn btn-primary" data-productId=${product.id} id="saveEditProduct">Save</button>
                  </div>
        
                </div>
              </div>
            </div>
        `;
}
