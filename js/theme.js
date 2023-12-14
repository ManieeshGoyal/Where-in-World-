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



export const container = document.querySelector(".container");

export const renderData = (data, index, style) => {
  const currencies = data?.currencies ? Object.values(data.currencies) : "N/A";
  const lang = data?.languages
    ? Object.values(data.languages).join(" , ")
    : "N/A";
  const name = data.name.common;
  const html = `
<article class=${style}>
<h2 class="neighbour-text">neighbour country</h2>
<div class = "country-card" data-index="${index}">
<div class="img-container">
<img  class="country-img" src="${data.flags.png}" alt = "country-flag" />
</div>
<div class="country-data">
    <h2 class="country-name">${name}</h2>
    <h3 class="country-region">${data.region}</h3>
    <p class="row"><span>🗣️</span> ${lang} </p>
    <p class="row"><span>💵</span> ${currencies[0].name} , ${
    currencies[0].symbol
  }
    </p>
    <p class="row"><span>👯</span>Population : ${(
      data.population / 1000000
    ).toFixed(1)} Million</p>
</div>
</div>
</article>`;

  container.insertAdjacentHTML("beforeend", html);
};