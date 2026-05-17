import { orderService } from "../../DataBase/services/orderService.js";
import { userService } from "../../DataBase/services/userService.js";
export function initOrdersBoard() {
  let newOrder = orderService.getAll();
  let statusThemes = {
    Shipped: "info",
    pending: "warning",
    cancelled: "danger",
    delivered: "success",
  };
  // Render Orders
  newOrder.forEach((order) => {
    const orderRow = `
                    <tr>
                        <td class="fw-bold">${order.id}</td>
                        <td>${userService.getById(order.userId).name}</td>
                        <td><span class="badge bg-${statusThemes[order.status]}-subtle text-${statusThemes[order.status]} border border-$${statusThemes[order.status]}">${order.status}</span></td>
                        <td class="fw-bold">${order.totalPrice.toFixed(2)} $</td>
                        <td class="text-muted small">${order.createdAt}</td>
                       
                    </tr>
                `;
    $("#ordersTableBody").append(orderRow);
  });
}
