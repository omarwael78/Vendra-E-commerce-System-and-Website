export default function shopFeatures() {
  return `
            <div id="shopFeatures" class="bg-body-tertiary d-lg-flex justify-content-around py-5 px-4 ">
            <div class="d-flex gap-3 ">
                <div class="bg-primary bg-opacity-50 p-2 rounded-3  " style="height: fit-content;"><i
                        class="fa-regular fa-truck h4 "></i></div>
                <div>
                    <p class="h5 fw-bold">Free Shipping</p>
                    <p class=" fw-lighter">On orders over $50</p>
                </div>
            </div>
            <div class="d-flex gap-3 ">
                <div class="bg-primary bg-opacity-50 p-2 rounded-3  " style="height: fit-content;">
                    <i class="fa-solid fa-shield h4 "></i>
                </div>
                <div>
                    <p class="h5 fw-bold">Secure Payment</p>
                    <p class=" fw-lighter">100% Secure transactions</p>
                </div>
            </div>
            <div class="d-flex gap-3 ">
                <div class="bg-primary bg-opacity-50 p-2 rounded-3  " style="height: fit-content;">
                    <i class="fa-solid fa-arrow-trend-up h4 "></i>
                </div>
                <div>
                    <p class="h5 fw-bold">Best Prices</p>
                    <p class=" fw-lighter">Guaranteed lowest prices</p>
                </div>
            </div>
        </div>`;
}
