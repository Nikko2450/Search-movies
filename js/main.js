const apiKey = "e7714302";
const url = "http://www.omdbapi.com/";
const tBody = document.querySelector("tbody");
const input = document.querySelector(".search__input");
const button = document.querySelector(".header__button");
const span = document.querySelector(".header__subtitle span");
let data = {};
let errorText = "";

const handleFetchMovieById = async (id) => {
  let movieInfo = {};
  await fetch(`${url}?i=${id}&apikey=${apiKey}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      movieInfo = value;
    })
    .catch((error) => {
      errorText = error;
    });

  return movieInfo;
};

const handleError = () => {
  const row = document.createElement("tr");
  row.classList.add("table__row");
  const cell = `
    <td class="table__cell" colspan="5"><p class="table__desc">${errorText}</p></td>
  `;
  row.innerHTML = cell;
  tBody.append(row);
};

const handleAddTotalResult = () => {
  span.innerText = data.totalResults;
};

const handleCreate = () => {
  data.Search.forEach(async (item) => {
    const movieInfo = await handleFetchMovieById(item.imdbID);
    const row = document.createElement("tr");
    row.classList.add("table__row");
    const cells = `
      <td class="table__cell">
        <p class="table__desc">
          ${item.Title}
        </p>
        <p class="table__subtitle">${movieInfo.Genre}</p>
      </td>
      <td class="table__cell сenter">
        <p class="table__desc">${item.Year}</p>
      </td>
      <td class="table__cell сenter">
        <p class="table__desc">${movieInfo.Country}</p>
      </td>
      <td class="table__cell">
        <p class="table__desc ellipsis">
          ${movieInfo.Plot}
        </p>
      </td>
      <td class="table__cell">
        <img class="table__img" src="${movieInfo.Poster}" alt="table-img" />
      </td>
    `;
    row.innerHTML = cells;
    tBody.append(row);
  });
};

const handleFetch = async (search) => {
  await fetch(`${url}?s=${search}&apikey=${apiKey}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      data = value;
    })
    .catch((error) => {
      errorText = error;
    });

  if (errorText || data.Response === "False") {
    errorText = data.Error;
    handleError();
  } else {
    handleAddTotalResult();
    handleCreate();
  }
};

button.addEventListener("click", () => {
  tBody.innerHTML = "";
  handleFetch(input.value);
});
