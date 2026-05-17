import { productCard } from "./card.js";
import { productService } from "../../DataBase/services/productService.js";
import { getCachedImage } from "../../DataBase/utils/cacheHelper.js";
import { getBasePath } from "../../assets/utils/basePath.js";
export function featuredProducts() {
  return `<div class=" bg-body-tertiary "><div id="featuredProducts" class=" container-lg py-5  px-4 ">
            <div class="d-flex justify-content-between">
                <div>
                    <p class="h2 fw-bold">Featured Products</p>
                    <p>HandPicked deals just for you</p>
                </div>
                <a href="${getBasePath()}/user/products/index.html"><div class="view-all text-primary align-self-center fw-bold">View All <i class="fa-solid fa-arrow-right"></i>
                </div></a>
            </div>
            <div id="featuredProductsContainer" class="row justify-content-around">
            <div class="w-100 d-flex justify-content-center align-items-center" style="height: 50vh;">
              <div class="spinner-border text-body " role="status"
                style="height: 100px !important; width: 100px !important;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            </div>
        </div></div>`;
}

export async function initFeaturedProducts(basePath) {
  const allProducts = productService.getAll();

  const featuredList = allProducts
    .filter((product) => product.featured === true)
    .filter((product) => product.stock > 0)
    .slice(0, 12);

  const cardPromises = featuredList.map(async (product) => {
    const imageUrl = product.images[0];

    // Get the cached version
    const finalImageSrc = await getCachedImage(imageUrl);

    return productCard(
      product.id,
      finalImageSrc,
      product.title,
      product.rating,
      product.reviews.length,
      product.price,
      product.finalPrice,
      product.featured,
      basePath,
    );
  });

  const allCardsHtml = await Promise.all(cardPromises);

  $("#featuredProductsContainer").empty();
  $("#featuredProductsContainer").append(allCardsHtml.join(""));

  const ratingElements = document.querySelectorAll(
    '[data-coreui-toggle="rating"]',
  );
  ratingElements.forEach((el) => {
    new coreui.Rating(el);
  });
}
