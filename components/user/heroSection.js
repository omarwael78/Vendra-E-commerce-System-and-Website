export default function heroSection(basepath) {
  return `
         <div id="heroSection" class="py-5 px-2 px-lg-3 text-light" >
           <div class=" mx-lg-4 mx-xl-5">
            <p class="hero-header w-100 fw-bold large-font"> Shop the Latest Products at Unbeatable Prices</p>
            <p class="h4 fw-light">Discover amazing deals on electronics, fashion, and more. Free shipping on orders
                over $50!
            </p>
            <div class="d-flex flex-column flex-md-row my-4">
                <a href="${basepath}/user/products/index.html" class=" bg-light border-1 border-secondary-subtle rounded-3 py-3 px-5 text-primary fw-bolder mx-3 my-3"
                    id="shopNowButton">Shop Now <i class="fa-solid fa-arrow-right"></i>
                </a>
                <a href="${basepath}/user/auth/register.html" class="rounded-3 py-3 px-5 text-light bg-primary  fw-bolder mx-3 signUp-hover my-3"
                    id="SignUpButton">Sign Up for Deals</a></div>
        </div>
  `;
}
