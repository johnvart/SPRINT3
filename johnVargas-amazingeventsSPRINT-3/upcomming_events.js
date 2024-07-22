//* Cards
const colCard = document.getElementById("colCard");

//* Checkboxs & Search Content
const contentCheck = document.getElementById("contenCheck");

//* Favorite
const biClassFav = document.querySelector(".biFavorites");

//* Object elements: currentDate - events
const fechaActual = data.currentDate;
const datos = data.events;

//* Events Lengths
const cardsLength = document.getElementById("cardsLength");

//! Filtrado de Proximas fechas
const filterComing = datos.filter((item) => item.date >= fechaActual);
// console.log(filterComing);

//! Cantidad de cards
let dataLength = filterComing.length;
cardsLength.innerHTML = dataLength;

//*-------------------------------------------
//! Cards Template (elementHTML: colCard)
const createCardTemplate = (item) => {
  let template = "";
  template += `<div class="col-md-6">
        <div class="card h-100"  id="card" key=${item._id}>
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

const renderCards = (arr, elementHTML) => {
  let structure = "";
  arr.forEach((item) => {
    structure += createCardTemplate(item);
  });
  elementHTML.innerHTML = structure;
};
renderCards(filterComing, colCard);

//*--------------------------------------------

//! Checkbox Template (elementHTML: contentCheck)
// me guardo las categorias en un array - sin elementos duplicados y ordenados
const filterCategories = [
  ...new Set(datos.map((item) => item.category)),
].sort();

const createCheckTemplates = (item) => {
  let template = "";
  template += `
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

const renderChecks = (arr, elementHTML) => {
  let structure = "";
  arr.forEach((item) => {
    structure += createCheckTemplates(item);
    elementHTML.innerHTML = structure;
  });
  return structure;
};
renderChecks(filterCategories, contentCheck);

//*--------------------------------------------

//! Search Template (elementHTMl: contentCheck)
const createSearchTemplate = () => {
  let template = "";
  template = template += `
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
  elementHTML.innerHTML += structure;
  return structure;
};
renderSearch(contentCheck);

//*--------------------------------------------

//! Filters & Listeners
// me creo las funciones de filtrado
function checksFilter(arrCom) {
  // checks seleccionados
  const nodeListChecks = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  let arrChecks = Array.from(nodeListChecks).map((input) => input.value);

  let itemFiltered =
    arrChecks.length > 0
      ? arrCom.filter((item) => arrChecks.includes(item.category))
      : arrCom;

  return itemFiltered;
}

function searchFilter(arrCom) {
  const inputValue = document.querySelector('input[type="search"]');
  const valueSearch = inputValue.value.toLowerCase();
  const normalizedValue =
    valueSearch.charAt(0).toUpperCase() + valueSearch.slice(1) || valueSearch;

  let inputSearch =
    normalizedValue !== ""
      ? arrCom.filter((item) => item.name.includes(normalizedValue))
      : arrCom;

  return inputSearch;
}

function combineFilters(arrCom) {
  let checksFilterResults = checksFilter(arrCom);
  let searchFilterResult = searchFilter(arrCom);

  let combined = checksFilterResults.filter((item) =>
    searchFilterResult.includes(item)
  );

  let dataLength = combined.length;
  cardsLength.innerHTML = dataLength;

  return combined;
}

const handlerChange = (arrCom, elementHTML) => {
  let combineResults = combineFilters(arrCom);
  if (combineResults.length === 0) {
    swal("Event is not found, try with other name...");
  }

  renderCards(combineResults, elementHTML);
};

const handlerSubmit = (e) => {
  e.preventDefault();
  contentCheck.addEventListener("input", () => handlerChange(datos, colCard));
};
contentCheck.addEventListener("change", () => handlerChange(datos, colCard));
contentCheck.addEventListener("submit", handlerSubmit);

//*--------------------------------------------

//! Favorites
let favorites = [];
function favoriteToggleColor(biClassFav, arr) {
  const toggleColor = biClassFav.classList.toggle("biFavRed");
  const cardItem = biClassFav.closest(".card");

  let eventItem = arr.find((ev) => cardItem.getAttribute("key") === ev._id);
  if (toggleColor) {
    favorites.push(eventItem);
  } else {
    favorites = favorites.filter((fav) => fav._id !== eventItem._id);
  }
  console.log("favorites: >>", favorites);
}

// agrego el evento a la card
function addCardFavoriteEvent() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("biFavorite")) {
      favoriteToggleColor(e.target, filterComing);
    }
  });
}
addCardFavoriteEvent();
