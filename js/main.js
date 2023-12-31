let currentProducts = products;
let basket = [];
let addToBasketButtons;

// donwload section with class products with offers.html
const productsSection = document.querySelector(".products");

const modalOffersPrice = document.querySelector(".modal-offers-price");
const basketAmountSpan = document.querySelector(".basket-amount"); 
const basketClearBtn = document.querySelector(".basket-clear-btn");

const addToBasket = (e) => {
	const selectedId = parseInt(e.target.dataset.id);

	const key = currentProducts.findIndex((product) => product.id === selectedId);

	basket.push(currentProducts.at(key));
	const basketTotal = basket.reduce((sum, product) => {
		if(product.sale === true) {
			return (sum += product.price - product.saleAmount)
		}
		
		return (sum += product.price); 
	}, 0);

	basketTotal > 0 
	? basketClearBtn.classList.add("active") 
	: basketClearBtn.classList.remove("active"); 
	basketAmountSpan.innerHTML = `Kwota ${basketTotal} zł.`;
	modalOffersPrice.innerHTML = `Cena: ${basketTotal} zł.`;
};

/* 
	Product offer cards on the website, which are placed in the database, 
	are rendered -- products.js -- all items
*/
const renderProducts = (items) => {
	productsSection.innerHTML = "";
	for(let i = 0; i < items.length; i++) {
		const newProduct = document.createElement('div');
		newProduct.className = `product-item ${items[i].sale ? "on-sale" : "on-status"}`;
		newProduct.innerHTML = `
		<img src="${items[i].image}" alt="${items[i].category}" />
		<p class="product-name">${items[i].name}</p>
		<p class="product-description">
			${items[i].description.slice(0, 100)}...
		</p>
		<div class="product-price">
		  <span class="price">${items[i].price.toFixed(2)} zł</span>
		  <span class="price-sale">${(items[i].price - items[i].saleAmount).toFixed(2)} zł</span>
		</div>
		<button data-id="${items[i].id}" class="product-add-to-basket-btn">Dodaj do koszyka</button>
		<p class="product-item-sale-info">${items[i].status}</p>
		
		`
		productsSection.appendChild(newProduct);
	}
	addToBasketButtons = document.querySelectorAll(".product-add-to-basket-btn");
	addToBasketButtons.forEach((btn) => btn.addEventListener("click", addToBasket));
}


/* 
	Displays all the categories it contains -- 
	-- with products.js -- category 
*/
const renderCategories = (items) => {
	
	// Create list of categories
	let categories = new Set();
	
	// Create list of categories for (promcje and nowość)
	let navStatus = new Set();
	
	for(let i =0; i < items.length; i++) {
		categories.add(items[i].category);
		if (items[i].status != "") {
			navStatus.add(items[i].status);
		}
	}

	const categoriesItems = document.querySelector(".categories-items");

	categories = ['Wszystkie', ...categories];

	categories.forEach((category, index, arr) => {
		const newCategory = document.createElement("button");
		newCategory.innerHTML = category;
		// add data-category to buttons categories in index.html
		newCategory.dataset.category = category;

		index === 0 ? newCategory.classList.add("active") : "";

		categoriesItems.appendChild(newCategory);
	})

	const statusNav = document.querySelector(".header-nav");

	navStatus = ['Wszystkie', ...navStatus];

	navStatus.forEach((status, index, arr) => {
		const newNavStatus = document.createElement("button");
		newNavStatus.innerHTML = status;
		// add data-category to buttons categories in index.html
		newNavStatus.dataset.status = status;

		index === 0 ? newNavStatus.classList.add("active"): "";
		statusNav.appendChild(newNavStatus)
	})
}

// When loading our page
document.onload = renderProducts(currentProducts);
document.onload = renderCategories(currentProducts);

const categoriesButtons = document.querySelectorAll('.categories-items button');

categoriesButtons.forEach(btn => btn.addEventListener('click', (e) => {
	const category = e.target.dataset.category;

	categoriesButtons.forEach((btn) => btn.classList.remove("active"));
	e.target.classList.add("active");

	currentProducts = products;

	if(category === 'Wszystkie') {
		currentProducts = products;
	} 
	else {
		currentProducts = currentProducts.filter((product) => product.category === category);
	}

	renderProducts(currentProducts);
}));

const navButtons = document.querySelectorAll('.header-nav button');

navButtons.forEach(btn => btn.addEventListener('click', (e) => {
	const nav = e.target.dataset.status;

	navButtons.forEach((btn) => btn.classList.remove("active"));
	e.target.classList.add("active");

	currentProducts = products;

	

	if(nav === 'Wszystkie') {
		currentProducts = products;
	} 
	else {
		currentProducts = currentProducts.filter((product) => product.status === nav);
	}

	renderProducts(currentProducts);
}));


const searchBarInput = document.querySelector(".search-bar-input");

searchBarInput.addEventListener("input", (e) => {
	const search = e.target.value;

	const foundProducts = currentProducts.filter((product) => {
		if(product.name.toLowerCase().includes(search.toLowerCase())) {
			return product;
		}
	});

	const emptyState = document.querySelector(".empty-state");

	foundProducts.length === 0 
	? emptyState.classList.add("active") 
	: emptyState.classList.remove("active");

	renderProducts(foundProducts);
});

const clearBasket = () => {
	basketAmountSpan.innerHTML = "Koszyk";
	basket = [];
};

basketClearBtn.addEventListener("click", clearBasket);

// Pagination
const pages = document.querySelectorAll('.page');
const offers = document.querySelectorAll('.product-item');

function showPage(pageNumber) {
  offers.forEach(function(offer) {
	offer.style.display = 'none';
  });

  const startIndex = (pageNumber - 1) * 3;
  const endIndex = startIndex + 3;

  for (let i = startIndex; i < endIndex; i++) {
	if (offers[i]) {
	  offers[i].style.display = 'block';
	}
  }
}

pages.forEach(function(page) {
  page.addEventListener('click', function() {
	pages.forEach(function(page) {
	  page.classList.remove('active');
	});

	this.classList.add('active');
	const pageNumber = parseInt(this.textContent);
	showPage(pageNumber);
	});
});

showPage(1);

// const basketAmountSpan = document.querySelector(".basket-amount"); 
// const basketClearBtn = document.querySelector(".basket-clear-btn");

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-modal")[0];



const addToBasketModal = (e) => {
	basketOffers = [];
	productsSection.innerHTML = "";
	
	for(let i = 0; i < items.length; i++) {
		
		const selectedId = parseInt(e.target.dataset.id);
		const key = currentProducts.findIndex((product) => product.id === selectedId);
		
		basketOffers.push(currentProducts.at(key));
		const basketProducts = basketOffers.reduce((sum, product) => {
			if(product.sale === true) {
				return (sum += product.price - product.saleAmount)
			}
			
			return (sum += product.price); 
		}, 0);

		basketOffers > 0 
		? basketClearBtn.classList.add("active") 
		: basketClearBtn.classList.remove("active"); 
		basketAmountSpan.innerHTML = `Kwota ${basketOffers} zł.`;

		const modalBody = document.getElementsByClassName("modal-body");
		modalBody.innerHTML = `
		<img src="${items[i].image}" alt="${items[i].category}" />
		<p class="product-name">${items[i].name}</p>
		<p class="product-description">
			${items[i].description.slice(0, 100)}...
		</p>
		<div class="product-price">
		  <span class="price">${items[i].price.toFixed(2)} zł</span>
		  <span class="price-sale">${(items[i].price - items[i].saleAmount).toFixed(2)} zł</span>
		</div>
		<button data-id="${items[i].id}" class="product-add-to-basket-btn">Dodaj do koszyka</button>
		<p class="product-item-sale-info">${items[i].status}</p>
		
		`
		productsSection.appendChild(newProduct);
	}
};

addToBasketOffers = document.querySelectorAll(".product-add-to-basket-btn");
addToBasketOffers.forEach((btn) => btn.addEventListener("click", addToBasketModal));

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}






/*
const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
const viemAll = document.querySelectorAll('.viem-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.viem-all)');
const longGoodList = document.querySelector('.long-goods-list');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const btnDanger = document.querySelector('.btn-danger');

const checkGoods = () => {

    const data = [];

    return async () => { //async - funkcja asynchroniczna | await - czekamy na wykonanie operacji 
        if (data.length) return data;
        
        const result = await fetch('db/db.json'); //fetch - API ustawione w przeglądarce umie zaprosić dane z servera po URL | zwraca promis - obetnica przejścia odpowiedzi od servera
        if (!result.ok) {
            throw 'Error: ' + result.status; //throw - wyjątek
        } 
        data.push(...(await result.json()));

        return data;
    };
};

const getGoods = checkGoods();

const cart = {
	cartGoods: JSON.parse(localStorage.getItem('cartKey')) || [],
	updateLocalStorage() {
		localStorage.setItem('cartKey', JSON.stringify(this.cartGoods));
	},
	getCountCartGoods() {
		return this.cartGoods.length;
	},
    countQuantity() {
        const count = this.cartGoods.reduce((sum, item) => {
            return sum + item.count;
        }, 0);
		cartCount.textContent = count ? count : '';
    },
    clearCart() {
        this.cartGoods.length = 0;
        this.countQuantity();
		this.updateLocalStorage();
        this.renderCart();
    },
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>$${price}</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + (item.price * item.count);
		}, 0);
		cardTableTotal.textContent = totalPrice + '$';
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
        this.countQuantity();
		this.updateLocalStorage();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if(item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
        this.countQuantity();
		this.updateLocalStorage();
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
        cart.countQuantity();
		this.updateLocalStorage();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id ===id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id , name, price }) => {
					this.cartGoods.push({
						id, 
						name,
						price,
						count: 1
					});
                    this.countQuantity();
					this.updateLocalStorage();
				});
		}
	},
}

btnDanger.addEventListener('click', cart.clearCart.bind(cart));

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');

	if(addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
})

//Destruktarycaja elementów
cartTableGoods.addEventListener('click', (event) => {
	const target =  event.target;

	if (target.classList.contains('cart-btn-delete')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.deleteGood(id);
	};
	if (target.classList.contains('cart-btn-minus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	}
	if (target.classList.contains('cart-btn-plus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	}
});

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', (event) => {
	const target = event.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) { //contains - checking for the presence of a class  
		closeModal();
	}
});



// goods //Destruktaryzacja
const createCard = ({ label, name, img, description, id, price }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'; 

	card.innerHTML = `
	<div class="goods-card">
		${label ? 
			`<span class="label">${label}</span>` : 
			''}
		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`;

	return card;
}

//Show card on page
const renderCards = (data) => {
	longGoodList.textContent = '';
	const cards = data.map(createCard); 
	longGoodList.append(...cards);
	document.body.classList.add('show-goods');
};


const showAll = (event) => { event.preventDefault(); getGoods().then(renderCards); };
viemAll.forEach((elem) => {
	elem.addEventListener('click', showAll);
});

const filterCards = (field, value) => {
	getGoods()
		.then((data) => data.filter((good) => good[field] === value))
		.then(renderCards);
};

navigationLink.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
});

showAcsessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Accessories');
	});
});

showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	});
});

// Work with OpenServer

const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: dataUser,
});

const validForm = (formData) => {
	let valid = false;

	for (const [,value] of formData) {
		if (value.trim()) {
			valid = true;
		} else {
			valid = false;
			break;
		}
	}

	return valid;
};

modalForm.addEventListener('submit', event => {
	event.preventDefault();
	const formData = new FormData(modalForm);

	if (validForm(formData) && cart.getCountCartGoods()) {
		const data = {};

		for (const [name, value] of formData) {
			data[name] = value;
		}

		data.cart = cart.cartGoods;
 
		postData(JSON.stringify(data))
			.then(response => {
				if (!response.ok) {
					throw new Error(response.status);
				}
				alert('Your order has been successfully sent, and you will be contacted as soon as possible.');
				console.log(response.statusText);
			})
			.catch(err => {
				alert('Unfortunately an error occurred, please try again later.');
				console.error(err);
			})
			.finally(() => {
				closeModal();
				modalForm.reset();
				cart.clearCart();
			});
	} else {
		if (!cart.getCountCartGoods()) {
			alert('The shopping cart is empty, add the product to the shopping cart');
		}
		if (!validForm(formData)) {
			alert('Fill in the fields correctly');
		}
	}
});

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
*/
