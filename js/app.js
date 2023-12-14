"use strict";

const container = document.querySelector(".container");
const searchBar = document.getElementById("search-bar");
const search = document.getElementById("search-btn");
const regionBtn = document.querySelector(".region-btn");
const regionMenu = document.querySelector(".region-dropdown-menu");

import { body,  dropdownOpactiy } from "./theme.js";

/**
 * *The `renderData` function takes a response from an API call, extracts relevant data, and dynamically
 * *generates HTML to display the country's information.
 */

const renderData = (data, style) => {
  const currencies = Object.values(data.currencies);
  const lang = Object.values(data.languages).join(" , ");
  const name = data.name.common;
  const html = `
<article class=${style}>
<h2 class="neighbour-text">neighbour country</h2>
<div class = "country-card">
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

/**
 * *The `fetchCountryData` function fetches data about a given country and its neighboring countries
 * *from a REST API and renders the data on a webpage.
 * *@param country - The `country` parameter is a string that represents the name of a country.
 */

const fetchCountryData = (country) => {
  const countryReq = fetch(`https://restcountries.com/v3.1/name/${country}`);
  countryReq
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          alert(
            `Sorry, the country you entered was not found (${response.status})`
          )
        );
      }
      return response.json();
    })
    .then((obj) => {
      const data = obj[0];
      renderData(data);

      if (!data.borders) return;

      for (let i of data.borders) {
        const neighbourCountryReq = fetch(
          `https://restcountries.com/v3.1/alpha/${i}`
        );

        neighbourCountryReq.then((response) =>
          response.json().then((data) => renderData(data[0], "neighbour-card"))
        );
      }
    });
};

/**
 * *The `getValue` function retrieves the value from a search bar, clears the container, and then
 * *fetches country data based on the search term.
 */
const getValue = () => {
  const searchTerm = searchBar.value;
  container.innerHTML = "";
  searchBar.value = "";
  fetchCountryData(searchTerm);
};

search.addEventListener("click", () => {
  if (searchBar.value != "" && searchBar.value != null) getValue();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value != "" && e.target.value != null) {
    getValue();
  }
});

/**
 * *drowndownOpactiy function that sets the z-index and opacity of a dropdown menu, and adds
 * *event listeners to show and hide the dropdown menus when certain buttons are clicked.
 */

regionBtn.addEventListener("click", () => dropdownOpactiy(regionMenu, 10, 1));

body.addEventListener("click", (e) => {
  if (!e.target.classList.contains("region-btn")) {
    dropdownOpactiy(regionMenu, -1, 0);
  }
});

//*The fetchRegionData

const fetchRegionData = (region) => {
  container.innerHTML = "";
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((response) => response.json())
    .then((data) => {
      for (let i of data) {
        renderData(i);
      }
    });
};

fetchRegionData("asia");

regionMenu.addEventListener("click", (e) => {
  const region = e.target.textContent;
  fetchRegionData(region);
});

// * store country name in session storage

container.addEventListener("click", (e) => {
  if (e.target == e.currentTarget) return;

  sessionStorage.setItem(
    "countryName",
    e.target.closest(".country-card").querySelector(".country-name").textContent
  );
  window.location.href = "country_details.html";
});
