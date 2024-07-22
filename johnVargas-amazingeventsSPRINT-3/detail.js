const detailCard = document.getElementById("detailCard");

const datos = data.events;
const current = data.currentDate;

const queryString = location.search;
const param = new URLSearchParams(queryString);

// el parametro identificador
const dataDetail = param.get("id");
const detail = datos.find((item) => item._id === dataDetail);

//* Favorite
const biClassFav = document.querySelector(".biFavorites");

//! Card Template
const createDetailTemplate = (item, current) => {
  let template = "";
  template = `
        <div class="card w-100" key=${item._id}>
            <div class="row g-0 align-item-center justify-content-evenly align-content-around">
                <div class="col-md-6">
                    <img
                        src=${item.image}
                        class="img-fluid w-100 h-100"
                        alt=${item.name}
                    >
                </div>
                <div class="vr md-2"></div>
                <div class="col-md-4">
                    <div class="card-body dataBody">
                    
                        <h4 class="card-title text-center">
                            ${item.name}
                        </h4>
                        <ul>
                            <li>Date:: ${item.date}</li>
                            <li>Place: ${item.place}</li>
                            <li>Capacity: ${item.capacity}</li>
                            <li>
                                ${
                                  item.date < current
                                    ? `Assistance: ${item.assistance}`
                                    : `Estimate: ${item.estimate}`
                                }
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
  return template;
};

const renderDetailTemplate = (item, current, elementHTML) => {
  let structure = "";
  structure += createDetailTemplate(item, current);
  elementHTML.innerHTML = structure;
  return structure;
};
renderDetailTemplate(detail, current, detailCard);

//*--------------------------------------------

//! Favorites
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function favoriteToggleColor(biClassFav, arr) {
  const toggleColor = biClassFav.classList.toggle("biFavRed");
  const cardItem = biClassFav.closest(".card");

  let eventItem = arr.find((ev) => cardItem.getAttribute("key") === ev._id);

  if (toggleColor) {
    favorites.push(eventItem);
  } else {
    favorites = favorites.filter((fav) => fav._id !== eventItem._id);
  }

  saveFavoritesToLocalStorage(favorites);
  console.log("favorites :>> ", favorites);
}

function saveFavoritesToLocalStorage(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addCardFavoriteEvent() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("biFavorite")) {
      favoriteToggleColor(e.target, datos);
    }
  });
}

addCardFavoriteEvent();
