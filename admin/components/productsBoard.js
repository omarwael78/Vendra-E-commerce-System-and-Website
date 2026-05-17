import { userService } from "../../DataBase/services/userService.js";
import { productService } from "../../DataBase/services/productService.js";

export function initProductsBoard() {
  let products = productService.getAll();
  // Render Products
  products.forEach((product) => {
    const productCard = `
                    <div class="col-12 card">
                        <div class="card-container row p-3">
                            <div class=" col-lg-4 justify-content-center d-flex" >
                                <img style="height: 250px;object-fit: contain;" class=" img-fluid rounded-start" src=${product.images[0]}>
                            </div>
                            
                            <div class="col-lg-6">
                            <div class="d-flex align-items-center justify-content-between"><h5 class="fw-bold mb-1">${product.title}</h5> <span class="bg-body-secondary p-2 m-2 rounded-3">${product.category}</span></div>
                            <p class="h3 fw-bold bg-body-tertiary p-2">${userService.getById(product.vendorId).name}</p>
                            <div class="rating">
                                ${renderStars(`${Math.round(product.rating)}`)}
                            <span class="count">(${product.reviews.length})</span>
                             </div>
                                <p class="text-muted small mb-0">${product.desc}</p>
                            </div>
                            <div class="text-end col-lg-2">
                                <p class="text-danger fw-bold fs-5 mb-1">${product.price}</p>
                                <span class="badge text-body  border">In Stock: ${product.stock}</span>
                                
                            </div>
                        </div>
                    </div>
                `;
    $("#productsList").append(productCard);
  });

  function renderStars(num) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fa-${i <= num ? "solid" : "regular"} fa-star"></i>`;
    }
    return stars;
  }
}
