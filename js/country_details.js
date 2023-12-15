"use strict";

const countryDetailsContainer = document.querySelector(
  ".country-details__container"
);
const neighbourSection = document.querySelector(".border-section");

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

  if (data.borders) {
    data.borders.forEach((border) => {
      const html = `<span class="secondary-btn">${border}</span>`;
      neighbourSection.insertAdjacentHTML("beforeend", html);
    });
  } else {
    neighbourSection.querySelector("p").innerHTML =
      "<h3>This country does not share borders with anyone.</h3>";
  }
};

const data = JSON.parse(sessionStorage.getItem("data"));
renderCountryData(data);

neighbourSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("secondary-btn")) {
    const border = e.target.textContent;
    fetch(`https://restcountries.com/v3.1/alpha/${border}`)
      .then((response) => response.json())
      .then((obj) => {
        const [data] = obj;
        countryDetailsContainer.textContent = "";
        neighbourSection.textContent = "";
        console.log(data);

        renderCountryData(data);
      });
  }
});
