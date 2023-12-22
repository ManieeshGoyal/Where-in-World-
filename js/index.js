"use strict";

const container = document.querySelector(".container");
const searchBar = document.getElementById("search-bar");
const search = document.getElementById("search-btn");
const regionBtn = document.querySelector(".region-btn");
const regionMenu = document.querySelector(".region-dropdown-menu");

import { body, dropdownOpactiy } from "./component.js";
// The `renderData` function takes a response from an API call, extracts relevant data, and dynamically
//generates HTML to display the country's information.

const renderData = (data, index) => {
  const currencies = data?.currencies ? Object.values(data.currencies) : "N/A";
  const lang = data?.languages
    ? Object.values(data.languages).join(" , ")
    : "N/A";
  const name = data.name.common;
  const html = `
<article class= "country-card" data-index = "${index}">
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

const fetchData = async (info, about) => {
  about = about ? `/${about}` : "";
  const url = `https://restcountries.com/v3.1/${info}${about}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// The code block is defining a function called `iterateCountriesData` that takes an array of country
// objects as input. and it return a function that store country data in session storage on card click

const iterateCountriesData = (obj) => {
  let index = 0;

  for (let data of obj) {
    renderData(data, index);
    index++;
  }

  return container.addEventListener("click", (e) => {
    if (e.target == e.currentTarget) return;
    const index = e.target.closest(".country-card").getAttribute("data-index");
    const strinifiedObj = JSON.stringify(obj[index]);
    sessionStorage.setItem("data", strinifiedObj);
    window.location.href = "countryDetails.html";
  });
};

//The code defines a function that searches for countries based on a search term, fetches data from an
//API, and renders the data on the webpage.

const searchCountry = () => {
  const searchTerm = searchBar.value;
  container.innerHTML = "";
  searchBar.value = "";
  fetchData("name", searchTerm).then((obj) => {
    localStorage.setItem("data", JSON.stringify(obj));
    iterateCountriesData(obj);
  });
};

search.addEventListener("click", () => {
  if (searchBar.value != " " && searchBar.value != null) searchCountry();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value != "" && e.target.value != null)
    searchCountry();
});

//renderig region by click event and call All rest api on page load

regionBtn.addEventListener("click", () => dropdownOpactiy(regionMenu, 10, 1));

body.addEventListener("click", (e) => {
  if (!e.target.classList.contains("region-btn")) {
    dropdownOpactiy(regionMenu, -1, 0);
  }
});

regionMenu.addEventListener("click", (e) => {
  sessionStorage.setItem("searchHistory", e.target.textContent);
  container.innerHTML = "";
  regionBtn.textContent = e.target.textContent;
  if (e.target.textContent == "All") {
    return fetchData("all").then((obj) => {
      localStorage.setItem("data", JSON.stringify(obj));
      iterateCountriesData(obj);
    });
  }
  fetchData("region", e.target.textContent).then((obj) => {
    localStorage.setItem("data", JSON.stringify(obj));
    iterateCountriesData(obj);
  });
});

// If local storage contains data then it will render data from local storage
// else it will render data from rest api

if (localStorage.getItem("data")) {
  regionBtn.textContent = sessionStorage.getItem("searchHistory");
  const obj = JSON.parse(localStorage.getItem("data"));
  iterateCountriesData(obj);
} else {
  fetchData("all").then((obj) => iterateCountriesData(obj));
}
