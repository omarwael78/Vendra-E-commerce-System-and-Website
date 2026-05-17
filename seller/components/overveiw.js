export function overviewPage(products, orders) {
  return `
    <div class="container-fluid">

      <!-- Row 1 : Cards -->
      <div class="row g-4 mb-4">

        <div class="col-md-3">
          <div class="card shadow-sm p-3">
            <h6>Total Revenue</h6>
            <h4>$31,200</h4>
            <small class="text-success">+12.5% from last month</small>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow-sm p-3">
            <h6>Total Orders</h6>
            <h4>${orders.length}</h4>
            <small class="text-success">+8.2% from last month</small>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow-sm p-3">
            <h6>Products</h6>
            <h4>${products.length}</h4>
            <small class="text-danger">3 out of stock</small>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow-sm p-3">
            <h6>Customers</h6>
            <h4>1,245</h4>
            <small class="text-success">+15.3% from last month</small>
          </div>
        </div>

      </div>

      <!-- Row 2 : Charts -->
      <div class="row g-4 mb-4">

        <div class="col-md-6">
          <div class="card shadow-sm p-3">
            <h6>Sales Overview</h6>
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card shadow-sm p-3">
            <h6>Monthly Revenue</h6>
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

      </div>

     
  `;
}
