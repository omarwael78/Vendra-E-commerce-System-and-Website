import { overview } from "../components/overview.js";
import { initUsersBoard } from "../components/usersBoard.js";

// navigation.js
export function initNavigation() {
  $("#sideNav .nav-link").on("click", function (e) {
    e.preventDefault();
    const $this = $(this);
    const target = $this.data("target");

    $("#sideNav .nav-link").removeClass("active");
    $this.addClass("active");

    $(".page-section").hide().removeClass("active-section");
    $("#" + target)
      .fadeIn(300)
      .addClass("active-section");

    $("#dynamicTitle").text($this.text().trim() + " Overview");
  });
}
