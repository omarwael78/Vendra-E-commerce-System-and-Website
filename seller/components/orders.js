import { orderService } from "../../DataBase/services/orderService.js";
import { productService } from "../../DataBase/services/productService.js";
import { userService } from "../../DataBase/services/userService.js";

export function ordersPage() {
  $(function () {
    const currentUser = userService.getCurrentUser();
    const vendorId = currentUser.id;

    const userOrders = orderService.getByVendor(vendorId);

    const statusThemes = {
      pending: "warning",
      Shipped: "info",
      cancelled: "danger",
      delivered: "success",
    };

    $("tbody").empty();

    userOrders.forEach((item) => {
      const product = productService.getById(item.productId);

      $("tbody").append(`
        <tr>
          <td class="text-nowrap">${item.orderId.substr(0, 8)}</td>
          <td class="product-col text-truncate">${product?.title || "Deleted Product"}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-nowrap">${item.total.toFixed(2)} $</td>
     <td>
  <span class="badge status-badge bg-${statusThemes[item.status]} me-2">
    ${item.status}
  </span>

    ${
      item.status === "pending"
        ? `  <select class="form-select form-select-sm status-select d-inline w-auto"
          data-id="${item.orderId}">
          
    <option value="cancelled" ${item.status === "cancelled" ? "selected" : ""}>Cancelled</option>
    <option value="Shipped" ${item.status === "Shipped" ? "selected" : ""}>Shipped</option>
    
  </select>`
        : ""
    }


</td>
          <td class="text-nowrap">
            ${new Date(item.date).toISOString().split("T")[0]}
          </td>
        </tr>
      `);
    });

    $(document).on("change", ".status-select", function () {
      const orderId = $(this).data("id");
      const newStatus = $(this).val();

      orderService.updateStatus(orderId, newStatus);

      const badge = $(this).closest("td").find(".status-badge");

      badge
        .removeClass("bg-warning bg-info bg-success bg-danger")
        .addClass(`bg-${statusThemes[newStatus]}`)
        .text(newStatus);
    });
  });

  return `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm p-3">
            <h6 class="mb-3">Recent Orders</h6>
            <div class="table-responsive">
              <table class="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
