//* Cards
const colCard = document.getElementById("colCard");

//* Checkboxs & Search Content
const contentCheck = document.getElementById("contenCheck");

//* Favorites
const biClassFav = document.querySelector(".biFavorite");

//* Object elements: currentDate - events
const fechaActual = data.currentDate;
const datos = data.events;

//* Events Lengths
let cardsLength = document.getElementById("cardsLength");
let dataLength = datos.length;
cardsLength.innerHTML = dataLength;

//*----------------------------------------

//! Cards Template (elementHTML: colCard)
const createTemplate = (item) => {
  let template = "";
  template += `<div class="col-md-6 px-2">
        <div class="card h-100" key=${item._id} data-favorite="false">
            <img src=${item.image} class="card-img-top" alt="imagen 2">
         
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">
                    ${item.description}
                </p>
            </div>
            <div class="hstack gap-3 text-center px-2 py-3">
                <div class="p-2 fw-bold">$ ${item.price}</div>
                <div class="p-2 ms-auto">
                <a href="details.html?id=${item._id}">Details</a>      
                </div>
            </div>
        </div>
    </div>`;
  return template;
};
const renderCards = (array, elementHTML) => {
  let structure = "";
  array.forEach((item) => {
    structure += createTemplate(item);
    elementHTML.innerHTML = structure;
  });
  return structure;
};
renderCards(datos, colCard);

//*----------------------------------------

//! Checkbox (elementHTML: contentCheck)
// me guardo las categorias en un array - sin elementos duplicados y ordenados
const filterCategories = [
  ...new Set(datos.map((item) => item.category)),
].sort();

const createCheckTemplate = (item) => {
  let template = "";
  template = `
        <div class="form-check-inline px-2">
            <input
                class="form-check-input"
                type="checkbox"
                id="${item}"
                value="${item}"
            >
            <label class="form-check-label" for=${item}
                >${item}</label
            >
        </div>
    `;
  return template;
};

const renderChecks = (array, elementHTML) => {
  let structure = "";
  array.forEach((item) => {
    structure += createCheckTemplate(item);
    elementHTML.innerHTML = structure;
  });
  return structure;
};
renderChecks(filterCategories, contentCheck);

//! Search Template
const createSearchTemplate = () => {
  let template = "";
  template += `
        <form class="d-inline-block" role="search" method="post">
            <div class="input-group">
                <input
                    class="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    name="search"
                    value=""
                >
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
            </div>
        </form>
    `;
  return template;
};

const renderSearch = (elementHTML) => {
  let structure = "";
  structure += createSearchTemplate();
  elementHTML.innerHTML += structure; // concateno con la existente
  return structure;
};
renderSearch(contentCheck);

//*----------------------------------------

//! Filters & Listeners

function cheksFiltered(arr) {
  // checks seleccionados
  const nodeListChecks = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  //paso a array
  let arrChecks = Array.from(nodeListChecks).map((input) => input.value);

  //filter
  let itemsFiltered =
    arrChecks.length > 0
      ? arr.filter((item) => arrChecks.includes(item.category))
      : arr;

  return itemsFiltered;
}

function searchFiltered(arr) {
  // capturo el valor
  const inputValue = document.querySelector('input[type="search"]');
  const valueSearch = inputValue.value.toLowerCase();
  // la primera con mayuscula
  const normalizedValue =
    valueSearch.charAt(0).toUpperCase() + valueSearch.slice(1) || valueSearch;
  // filter
  let inputSearch =
    normalizedValue !== ""
      ? arr.filter((item) => item.name.includes(normalizedValue))
      : arr;

  return inputSearch;
}

function combineFilters(arr) {
  // me traigo las funciones de filtrado
  let checksFilterResults = cheksFiltered(arr);
  let searchFilterResult = searchFiltered(arr);

  let combined = checksFilterResults.filter((item) =>
    searchFilterResult.includes(item)
  );

  let cardsLength = document.getElementById("cardsLength");
  let dataLength = combined.length;
  cardsLength.innerHTML = dataLength;

  return combined;
}

const handlerChange = (arr, elementHTML) => {
  let combineResults = combineFilters(arr);
  if (combineResults.length === 0) {
    swal("Sorry, the event cannot be found, try another name....");
  }
  renderCards(combineResults, elementHTML);
};

const handlerSubmit = (e) => {
  e.preventDefault();
  contentCheck.addEventListener("input", () => handlerChange(datos, colCard));
};

// inyecto los escuchadores
contentCheck.addEventListener("change", () => handlerChange(datos, colCard));
contentCheck.addEventListener("submit", handlerSubmit);

//*----------------------------------------

//! Favorites

const createTemplateFavorite = (item) => {
  let template = "";
  template = `
        <li class="card h-100" key=${item._id} data-favorite="true">
            <img src=${item.image} class="card-img-top" alt="imagen 2">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">
                    ${item.description}
                </p>
            </div>
            <div class="hstack gap-3 text-center px-2 py-3">
                <div class="p-2 fw-bold">$ ${item.price}</div>
                <div class="p-2 ms-auto">
                <a href="details.html?id=${item._id}">Details</a>      
                </div>
            </div>
        </li>
    `;
  return template;
};

const renderCardsFavorite = (array, elementHTML) => {
  let structure = "";
  array?.forEach((item) => {
    structure += createTemplateFavorite(item);
  });
  elementHTML.innerHTML = structure;
  return structure;
};

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function favoriteToggleColor(biClassFav, arr, arrFav) {
  const toggleColor = biClassFav.classList.toggle("biFavRed");
  const cardItem = biClassFav.closest(".card");
  const favEvent = document.getElementById("fav-cards");

  let eventItem = arr.find((ev) => cardItem.getAttribute("key") === ev._id);

  if (toggleColor) {
    arrFav.push(eventItem);
  } else {
    arrFav = arrFav.filter((fav) => fav._id !== eventItem._id);
  }

  saveFavoritesToLocalStorage(favorites);
  renderCardsFavorite(arrFav, favEvent);
}

function saveFavoritesToLocalStorage(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addCardFavoriteEvent() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("biFavorite")) {
      favoriteToggleColor(e.target, datos, favorites);
    }
  });
}

addCardFavoriteEvent();

//* Aside Favorites
function asideToggleOpen(elementHTML) {
  let isOpen = false;

  const toggleOpen = () => {
    isOpen = !isOpen;
    elementHTML.classList.toggle("open", isOpen);
    elementHTML.classList.toggle("closed", !isOpen);
  };

  return toggleOpen;
}

function showFavoriteAside(arrFav) {
  const asideFavorite = document.getElementById("fav-aside");
  const showAside = document.getElementById("show-fav");
  const favEvent = document.getElementById("fav-cards");
  let toggleAside = asideToggleOpen(asideFavorite);

  if (arrFav.length > 0) {
    asideFavorite.classList.add("open");
    renderCardsFavorite(arrFav, favEvent);
  }

  showAside.addEventListener("click", toggleAside);
}
showFavoriteAside(favorites);
