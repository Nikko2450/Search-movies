const apiKey = "e7714302";
const url = "https://www.omdbapi.com/";
const tBody = document.querySelector("tbody");
const input = document.querySelector(".search__input");
const button = document.querySelector(".header__button");
const span = document.querySelector(".header__subtitle span");
let data = {};
let errorText = "";
let inputValue = "";
let pagination;

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
        ${
          movieInfo.Poster === "N/A"
            ? `<p class="table__desc">${movieInfo.Poster}</p>`
            : `<img class="table__img" src="${movieInfo.Poster}" alt="${item.Title}" />`
        }
      </td>
    `;
    row.innerHTML = cells;
    tBody.append(row);
  });
};

const handleFetch = async (search, page) => {
  await fetch(`${url}?s=${search}&apikey=${apiKey}&page=${page}`, {
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

  tBody.innerHTML = "";

  if (errorText || data.Response === "False") {
    errorText = data.Error;
    handleError();
  } else {
    handlePagination();
    handleAddTotalResult();
    handleCreate();
  }
};

input.addEventListener("input", (event) => {
  inputValue = event.target.value;
});

button.addEventListener("click", () => {
  handleFetch(inputValue, "1");
});

const handlePagination = () => {
  if (!pagination) {
    pagination = new tui.Pagination(document.getElementById("pagination"), {
      totalItems: data.totalResults,
      visiblePages: 5,
      centerAlign: true,
    });
  }

  pagination.on("beforeMove", (event) => {
    handleFetch(inputValue, event.page);
  });
};
