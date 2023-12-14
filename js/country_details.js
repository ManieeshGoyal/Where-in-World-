"use strict";

import { renderData as renderNeighbourData, container } from "./theme.js";

const countryDetailsContainer = document.querySelector(
  ".country-details__container"
);

const renderCountryData = (data) => {
  const currencies = data?.currencies ? Object.values(data.currencies) : "N/A";
  const lang = Object.values(data.languages).join(" , ");
  const name = data.name.common;
  const officialName = data?.name ? data.name.official : "N/A";
  const region = data.region;
  const subregion = data.subregion;
  const capital = data?.capital ? data.capital[0] : "N/A";
  const population = new Intl.NumberFormat(navigator.language).format(
    data.population
  );
  const html = ` 
   <section class="u-flex">
  <div class="img-section">
      <img src=${data.flags.png}
 alt="country-image">
  </div>

  <div class="u-flex details-container">
      <div class="details-section">
          <h2 class="name u-margin-btm-small">${name}</h2>
          <div>
              <p>Offical Name : ${officialName}</p>
              <p>Region : ${region}</p>
              <p>Subregion :${subregion}</p>
              <p>Capital : ${capital}</p>
              <p>Population : ${population}</p>
          </div>
      </div>

      <div class="other-details-section">
          <div>
              <p>Languages : ${lang}</p>
              <p>currencies : ${currencies[0].name} , ${currencies[0].symbol}</p>
          </div>
      </div>
  </div>
</section>
`;

  countryDetailsContainer.insertAdjacentHTML("beforeend", html);
};

const data = JSON.parse(sessionStorage.getItem("data"));
renderCountryData(data);

// console.log(data.borders);

if (data.borders) {
  const neighbourData = [];

  data.borders.forEach(async (border) => {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${border}`
    );
    neighbourData.push(await response.json());
  });
  console.log(neighbourData);
  // iterateCountriesData(neighbourData, "neighbour-card");
  renderNeighbourData(neighbourData[0], "neighbour-card");
}

// ! 2 approach

// if (data.borders) {
//   const neighbourData = [];

//   data.borders.forEach((border) => {
//     fetch(`https://restcountries.com/v3.1/alpha/${border}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         neighbourData.push(data[0]);
//       });
//   });
//   console.log(neighbourData);
//   // iterateCountriesData(neighbourData, "neighbour-card");
//   renderNeighbourData(neighbourData[0], "neighbour-card");
// }

// ! 3 approach

if (data.borders) {
  const neighbourData = data.borders.map((border) => {
    fetch(`https://restcountries.com/v3.1/alpha/${border}`)
      .then((res) => res.json())
      .then((data) => {
        return data[0];
      });
  });
  console.log(neighbourData);
}
