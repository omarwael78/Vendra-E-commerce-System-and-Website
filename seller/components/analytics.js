 
 
    import { orderService } from "../../DataBase/services/orderService.js";
 import { productService } from "../../DataBase/services/productService.js";
 import { userService } from "../../DataBase/services/userService.js";
 
 let salesChart = null;
 let statusChart = null;
 
 export function analyticsPage() {
 
   const currentUser = userService.getCurrentUser();
   if (!currentUser) return `<p>User not found</p>`;
 
   const vendorId = currentUser.id;
 
   const userOrders = orderService.getByVendor(vendorId);
   const userProducts = productService.getByVendor(vendorId);
 
   const totalSales = userOrders.reduce((sum, order) => sum + order.total, 0);
   const totalOrders = userOrders.length;
   const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
   const netProfit = totalSales * 0.35;
 
   const productSalesMap = {};
 
   userOrders.forEach((order) => {
     if (!productSalesMap[order.productId]) {
       productSalesMap[order.productId] = { quantity: 0, revenue: 0 };
     }
     productSalesMap[order.productId].quantity += order.quantity;
     productSalesMap[order.productId].revenue += order.total;
   });
 
   const topProducts = Object.entries(productSalesMap)
     .map(([productId, data]) => {
       const product = productService.getById(productId);
       return {
         title: product ? product.title : "Deleted Product",
         quantity: data.quantity,
         revenue: data.revenue.toFixed(2),
       };
     })
     .sort((a, b) => b.quantity - a.quantity)
     .slice(0, 5);
 
   const orderStatusCounts = { pending: 0, Shipped: 0, cancelled: 0, delivered: 0 };
 
   userOrders.forEach((o) => {
     orderStatusCounts[o.status] =
       (orderStatusCounts[o.status] || 0) + 1;
   });
 
    
   return `
     <div class="container-fluid">
       <div class="mb-4">
         <h3>Analytics</h3>
         <p class="text-muted">Track your store performance</p>
       </div>
 
       <div class="row g-4 mb-4">
         <div class="col-md-3">
           <div class="card shadow-sm p-3">
             <h6>Total Sales</h6>
             <h4>$${totalSales.toFixed(2)}</h4>
           </div>
         </div>
 
         <div class="col-md-3">
           <div class="card shadow-sm p-3">
             <h6>Net Profit</h6>
             <h4>$${netProfit.toFixed(2)}</h4>
           </div>
         </div>
 
         <div class="col-md-3">
           <div class="card shadow-sm p-3">
             <h6>Orders</h6>
             <h4>${totalOrders}</h4>
           </div>
         </div>
 
         <div class="col-md-3">
           <div class="card shadow-sm p-3">
             <h6>Avg Order Value</h6>
             <h4>$${avgOrderValue.toFixed(2)}</h4>
           </div>
         </div>
       </div>
 
       <div class="row g-4 mb-4">
         <div class="col-md-8">
           <div class="card shadow-sm p-3">
             <h6>Sales Trend</h6>
             <canvas id="analyticsSalesChart"></canvas>
           </div>
         </div>
 
         <div class="col-md-4">
           <div class="card shadow-sm p-3">
             <h6>Orders Status</h6>
             <canvas id="ordersStatusChart"></canvas>
           </div>
         </div>
       </div>
 
       <div class="row">
         <div class="col-12">
           <div class="card shadow-sm p-3">
             <h6>Top Selling Products</h6>
             <table class="table align-middle">
               <thead>
                 <tr>
                   <th>Product</th>
                   <th>Sold</th>
                   <th>Revenue</th>
                 </tr>
               </thead>
               <tbody>
                 ${topProducts.map(p => `
                   <tr>
                     <td>${p.title}</td>
                     <td>${p.quantity}</td>
                     <td>$${p.revenue}</td>
                   </tr>
                 `).join("")}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   `;
 }
 
  
 export function initAnalyticsCharts() {
 
   const currentUser = userService.getCurrentUser();
   if (!currentUser) return;
 
   const vendorId = currentUser.id;
   const userOrders = orderService.getByVendor(vendorId);
 
   const orderStatusCounts = { pending: 0, Shipped: 0, cancelled: 0, delivered: 0 };
 
   userOrders.forEach((o) => {
     orderStatusCounts[o.status] =
       (orderStatusCounts[o.status] || 0) + 1;
   });
 
   const salesDates = [...new Set(
     userOrders.map(o => new Date(o.date).toISOString().split("T")[0])
   )].sort();
 
   const salesData = salesDates.map(d =>
     userOrders
       .filter(o => new Date(o.date).toISOString().split("T")[0] === d)
       .reduce((sum, o) => sum + o.total, 0)
   );
 
   const ctxSales = document.getElementById("analyticsSalesChart");
   const ctxStatus = document.getElementById("ordersStatusChart");
 
   if (!ctxSales || !ctxStatus) return;
 
    
   if (salesChart) salesChart.destroy();
   if (statusChart) statusChart.destroy();
 
   salesChart = new Chart(ctxSales, {
     type: "line",
     data: {
       labels: salesDates,
       datasets: [{
         label: "Sales ($)",
         data: salesData,
         borderColor: "#0d6efd",
         backgroundColor: "rgba(13,110,253,0.1)",
         tension: 0.3
       }]
     },
     options: {
       responsive: true,
       scales: { y: { beginAtZero: true } }
     }
   });
 
   statusChart = new Chart(ctxStatus, {
     type: "doughnut",
     data: {
       labels: ["Pending", "Shipped", "Cancelled", "Delivered"],
       datasets: [{
         data: [
           orderStatusCounts.pending,
           orderStatusCounts.Shipped,
           orderStatusCounts.cancelled,
           orderStatusCounts.delivered
         ],
         backgroundColor: ["#ffc107","#0dcaf0","#dc3545","#198754"]
       }]
     },
     options: {
       responsive: true,
       plugins: { legend: { position: "bottom" } }
     }
   });
 }