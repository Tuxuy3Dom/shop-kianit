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

