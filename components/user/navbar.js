import { userService } from "../../DataBase/services/userService.js";
import { initToast } from "../../utils/toast.js";

export function navbar(basePath) {
  return `
  <div id="navbar" class="w-100 sticky-top bg-body border-bottom z-3">
  
    <!--  Navbar  -->
    <nav class="navbar px-3">
      <div class="container-fluid p-0">
      
        <!-- Logo (LEFT) -->
        <a class="navbar-brand d-flex align-items-center gap-2" href="${basePath}/index.html">
        <div class="rounded" >
          <img style="height:2rem;" src="${basePath}/assets/vendra.png"></div>
          <span class="fw-bold" style=" font-family:'Fjalla One', 'Poppins', Arial, sans-serif;
          letter-spacing:3px">Vendra</span>
        </a>

        <!-- Hamburger (RIGHT - Mobile only) -->
        <button class="btn d-lg-none"
        data-bs-toggle="collapse"
        data-bs-target="#mobileMenu">
        <i class="fa-solid fa-bars fs-4"></i>
        </button>
        
        <!-- Desktop Menu -->
        <div class="d-none d-lg-flex align-items-center gap-4 ms-auto">
        <a href="${basePath}/index.html" class="nav-link">Home</a>
        <a href="${basePath}/user/products/index.html" class="nav-link">Products</a>
        
        <button id="themeToggle" class="btn btn-body rounded">
        <i class="fa-regular fa-moon"></i>
        </button>
        
        <a  class="position-relative btn btn-body rounded cart-btn">
        <i class="fa-solid fa-cart-shopping"></i>
            <span class="cart-badge" id="cartCount">0</span>
          </a>
         <div class="text-center Profile d-flex align-items-center" >
         
          </div>

          </div>
          
          </div>
          </nav>
          
          <!--  Mobile Menu  -->
          <div id="mobileMenu" class="collapse d-lg-none border-top bg-body">
      <div class="container py-3 text-start">
      
      
      <!-- Menu items (LEFT aligned) -->
      <a href="${basePath}/index.html" class="nav-link w-100"> <i class="fa-solid fa-house me-3"></i>Home</a>
      <a href="${basePath}/user/products/index.html" class="nav-link w-100"><i class="fa-solid fa-bag-shopping me-3"></i>Products</a>
      
      <button id="themeToggleMobile" class="btn btn-body w-100 text-start p-0">
      <i class="fa-regular fa-moon" style="margin-right:.8rem !important;"></i>
      Dark Mode
      </button>
      
      <a class="nav-link w-100 cart-btn">
      <i class="fa-solid fa-cart-shopping me-3"></i>
          Cart (<span id="cartCountMobile">0</span>)
          </a>
          
          <!-- Sign In (CENTER + FULL WIDTH) -->
          <div class="text-center Profile " >
          </div>
          
          </div>
    </div>
    
    </div>
    `;
}

//
export function initNavBar(basePath) {
  /*  Theme Toggle  */
  const html = document.documentElement;

  function setupToggle(id) {
    const btn = document.getElementById(id);
    if (!btn) return;

    const icon = btn.querySelector("i");
    const savedTheme = localStorage.getItem("theme") || "light";

    html.setAttribute("data-bs-theme", savedTheme);
    icon.className =
      savedTheme === "dark"
        ? "fa-regular fa-sun text-warning"
        : "fa-regular fa-moon";

    btn.addEventListener("click", () => {
      const current = html.getAttribute("data-bs-theme");
      const next = current === "light" ? "dark" : "light";

      html.setAttribute("data-bs-theme", next);
      localStorage.setItem("theme", next);

      icon.className =
        next === "dark"
          ? "fa-regular fa-sun  text-warning"
          : "fa-regular fa-moon";
    });
  }

  let currentUser = userService.getCurrentUser();
  $(document).on("click", ".cart-btn", function () {
    if (currentUser !== "" && currentUser !== null)
      window.location.href = `${basePath}/user/cart/index.html`;
    else initToast("Please login first", "warning");
  });
  if (currentUser !== "" && currentUser !== null) {
    $(".Profile").html(`
      <div class="position-relative">
      <a class="btn btn-body rounded w-100 border"  data-bs-toggle="collapse" data-bs-target="#list">
        <i style="font-size:1.5rem;" class="fa-regular fa-circle-user " ></i>
      </a>
      <div id="list" class="collapse mt-2 position-absolute bg-body list-group end-50 " style="width:max-content">
        <button  class="list-group-item list-group-item-action profile-btn" >
          Profile
        </button>
        <button class="list-group-item list-group-item-action signout-btn">Sign Out</button>
        
      </div>
      </div>
    `);
  } else {
    $(".Profile").html(`
      <a href="${basePath}/user/auth/login.html" class="btn btn-primary w-100">
        Sign In
      </a>
    `);
  }
  $(".profile-btn").click(function () {
    window.location.href = `${basePath}/user/auth/profile.html`;
  });
  $(".signout-btn").click(function () {
    userService.deleteCurrentUser();
    location.reload(true);
  });
  setupToggle("themeToggle");
  setupToggle("themeToggleMobile");
}
