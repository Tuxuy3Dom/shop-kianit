// $getJSON('data.json', function(data) {
//     var output = "<ul";
//     for (var i in data.products) {
//         output += "<li>" + data.products[i].name + "</li>"
//         output += "<li>" + data.products[i].price + "</li>"
//         output += "<li>" + data.products[i].category + "</li>"
//     }
//     output += "</ul>";
//     document.getElementById('categories').innerHTML = output;
// });

// Pobierz wszystkie kategorie
var categories = document.getElementsByClassName("category");

// Dodaj nasłuchiwacz zdarzeń do każdej kategorii
for (var i = 0; i < categories.length; i++) {
  categories[i].addEventListener("click", toggleSubcategories);
}

// Funkcja obsługująca rozwijanie/zwijanie podkategorii
function toggleSubcategories() {
  var subcategories = this.getElementsByClassName("subcategories")[0];
  subcategories.style.display = subcategories.style.display === "none" ? "block" : "none";
}

// var currentPage = 1;
// var itemsPerPage = 5; // Liczba ofert na stronie
// var offers = [        
//     {
//     "id": "001",
//     "img": "img/latarka.png",
//     "name": "Lampa warsztatowa 10W COB LED 1000 lm + 3W LED UV 395nm, akumulatorowa, IK08, IP54, z zaczepem i magnesem",
//     "label": "new",
//     "description": "Red and Blue",
//     "price": "219",
//     "category": "Latarka"
//     },
//     {
//     "id": "002",
//     "img": "img/IMAGE1.png",
//     "name": "Pasek skórzany exclusive",
//     "label": "new",
//     "description": "Brown",
//     "price": "570",
//     "category": "Akcesoria"
// }]; // Tablica z ofertami

// function displayOffers(page) {
//   var startIndex = (page - 1) * itemsPerPage;
//   var endIndex = startIndex + itemsPerPage;
//   var offersToShow = offers.slice(startIndex, endIndex);

//   // Wyświetlanie ofert
//   var offerList = document.getElementById("offer-list");
//   offerList.innerHTML = "";
//   for (var i = 0; i < offersToShow.length; i++) {
//     var offer = offersToShow[i];
//     // Tworzenie elementów HTML dla oferty i dodawanie ich do offerList
//   }

//   // Wyświetlanie paginacji
//   var paginationList = document.querySelector(".pagination-list");
//   paginationList.innerHTML = "";
//   var totalPages = Math.ceil(offers.length / itemsPerPage);
//   for (var i = 1; i <= totalPages; i++) {
//     var li = document.createElement("li");
//     var link = document.createElement("a");
//     link.href = "#";
//     link.innerText = i;
//     if (i === currentPage) {
//       link.className = "current";
//     }
//     link.addEventListener("click", function (event) {
//       event.preventDefault();
//       currentPage = parseInt(this.innerText);
//       displayOffers(currentPage);
//     });
//     li.appendChild(link);
//     paginationList.appendChild(li);
//   }
// }

// // Przykładowe oferty
// offers = [
//   // Dane ofert
// ];

// displayOffers(currentPage);

