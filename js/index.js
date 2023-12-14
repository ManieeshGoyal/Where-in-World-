"use strict";

// const container = document.querySelector(".container");
const searchBar = document.getElementById("search-bar");
const search = document.getElementById("search-btn");
const regionBtn = document.querySelector(".region-btn");
const regionMenu = document.querySelector(".region-dropdown-menu");

import { body, dropdownOpactiy, renderData, container } from "./theme.js";

//  * *The `renderData` function takes a response from an API call, extracts relevant data, and dynamically
//  * *generates HTML to display the country's information.

// export const renderData = (data, index, style) => {
//   const currencies = data?.currencies ? Object.values(data.currencies) : "N/A";
//   const lang = data?.languages
//     ? Object.values(data.languages).join(" , ")
//     : "N/A";
//   const name = data.name.common;
//   const html = `
// <article class=${style}>
// <h2 class="neighbour-text">neighbour country</h2>
// <div class = "country-card" data-index="${index}">
// <div class="img-container">
// <img  class="country-img" src="${data.flags.png}" alt = "country-flag" />
// </div>
// <div class="country-data">
//     <h2 class="country-name">${name}</h2>
//     <h3 class="country-region">${data.region}</h3>
//     <p class="row"><span>🗣️</span> ${lang} </p>
//     <p class="row"><span>💵</span> ${currencies[0].name} , ${
//     currencies[0].symbol
//   }
//     </p>
//     <p class="row"><span>👯</span>Population : ${(
//       data.population / 1000000
//     ).toFixed(1)} Million</p>
// </div>
// </div>
// </article>`;

//   container.insertAdjacentHTML("beforeend", html);
// };

//  * The fetchData function is an asynchronous function that fetches data about a country from a REST
//  * API and returns the data.
//  * @param info - The "info" parameter is used to specify the type of information you want to retrieve
//  * about a country. It can be one of the following values: "name", "alpha", "capital", "currency",
//  * "language", "callingcode", "region", "subregion", "population", "
//  * @param about - The "about" parameter specifies the specific information or details you want to
//  * retrieve about a country.
//  * @returns The `fetchData` function is returning a promise.

const fetchData = async (info, about) => {
  about = about ? `/${about}` : "";
  const url = `https://restcountries.com/v3.1/${info}${about}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// *The code block is defining a function called `iterateCountriesData` that takes an array of country
// *objects as input. and it return a function that store country data in session storage on card click

const iterateCountriesData = (obj, style = "") => {
  let index = 0;
  for (let data of obj) {
    renderData(data, index, style);
    index++;
  }

  return container.addEventListener("click", (e) => {
    if (e.target == e.currentTarget) return;

    const index = e.target.closest(".country-card").getAttribute("data-index");
    const strinifiedObj = JSON.stringify(obj[index]);
    sessionStorage.setItem("data", strinifiedObj);
    window.location.href = "country_details.html";
  });
};

//  * The code defines a function that searches for countries based on a search term, fetches data from an
//  * API, and renders the data on the webpage.

// TODO:  CHANGE THE FUNCTIONALITY OF searchCountries()

const searchCountries = () => {
  const searchTerm = searchBar.value;
  container.innerHTML = "";
  searchBar.value = "";
  fetchData("name", searchTerm).then((obj) => {
    const [data] = obj;
    renderData(data);

    if (!data.borders) return;

    for (let i of data.borders) {
      fetchData("alpha", i).then((obj) => {
        const [data] = obj;
        renderData(data, "neighbour-card");
      });
    }
  });
};

search.addEventListener("click", () => {
  if (searchBar.value != " " && searchBar.value != null) searchCountries();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value != "" && e.target.value != null)
    searchCountries();
});

//* renderig region by click event and call All rest api on page load

fetchData("all").then((obj) => iterateCountriesData(obj));

regionBtn.addEventListener("click", () => dropdownOpactiy(regionMenu, 10, 1));

body.addEventListener("click", (e) => {
  if (!e.target.classList.contains("region-btn")) {
    dropdownOpactiy(regionMenu, -1, 0);
  }
});

regionMenu.addEventListener("click", (e) => {
  container.innerHTML = "";
  regionBtn.textContent = e.target.textContent;
  if (e.target.textContent == "All") {
    return fetchData("all").then((obj) => iterateCountriesData(obj));
  }
  fetchData("region", e.target.textContent).then((obj) =>
    iterateCountriesData(obj)
  );
});
