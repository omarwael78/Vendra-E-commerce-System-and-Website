export function category(emoji, catName, itemsNum) {
  return `<a  href="./user/products/index.html?category=${catName}" id="Category" class=" text-body category text-center my-5 d-inline-block rounded-4 shadow-sm col-5 col-lg-3 bg-body-tertiary  col-xl rounded-lg p-3 " >
                    <p id="emoji" class="h1 p-2">${emoji}</p>
                    <p class="h5 fw-bold">${catName.charAt(0).toUpperCase() + catName.slice(1)}</p>
                    <p>${itemsNum} items</p>
                </a>`;
}
