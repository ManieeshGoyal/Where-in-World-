"use strict";

export const body = document.querySelector("body");
const themeBtn = document.querySelector(".theme-btn");
const themeMenu = document.querySelector(".theme-dropdown-menu");

export const dropdownOpactiy = (menu, z_Index, opacity) => {
  menu.style.zIndex = z_Index;
  menu.style.opacity = opacity;
};

// if (!window.localStorage.getItem("theme")) {
//   window.localStorage.setItem("theme", "theme_6");
// }

themeBtn.addEventListener("click", () => dropdownOpactiy(themeMenu, 10, 1));

body.addEventListener("click", (e) => {
  if (!e.target.classList.contains("theme-btn")) {
    dropdownOpactiy(themeMenu, -1, 0);
  }
});

themeMenu.addEventListener("click", (e) => {
  const value = e.target.getAttribute("data-theme");
  body.setAttribute("class", " ");
  window.localStorage.setItem("theme", `theme_${value}`);
  body.classList.add(window.localStorage.getItem("theme"));
});

body.classList.add(window.localStorage.getItem("theme"));

// * store country name in local storage

const storeCountryName = (data) => {
  localStorage.setItem("country-name", data);
  window.location.href = "countryDetail.html";
};

