// open-list
const toggleBtn = document.querySelector("#open-list");
const aside = document.querySelector("aside");

toggleBtn.addEventListener("click", function () {
  aside.classList.toggle("hidden");

  if (aside.classList.contains("hidden")) {
    toggleBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
  } else {
    toggleBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  }
});







// Global states for cart & wishlist
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
let loveItems = JSON.parse(localStorage.getItem('wishlist')) || [];

const cartCounter = document.getElementById("number-card");
const loveCounter = document.getElementById("number-heart");

updateCounters();

async function fetchCategories() {
  try {
    const res = await fetch('https://dummyjson.com/products/categories');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

const tabs = document.querySelector('.tabs');

function renderTabs(categories) {
  tabs.innerHTML = categories
    .map(
      (cat) => `
      <li class="text-2xl py-2 cursor-pointer hover:text-[#93c9f9] category-tab" data-category="${cat.slug}">
        ${cat.name}
      </li>`
    )
    .join('');

  addTabClickListeners();
}

function addTabClickListeners() {
  const tabItems = document.querySelectorAll('.category-tab');

  tabItems.forEach(tab => {
    tab.addEventListener('click', async () => {
      const category = tab.dataset.category;
      try {
        const res = await fetch(`https://dummyjson.com/products/category/${category}`);
        const data = await res.json();
        renderProducts(data.products);
        tabItems.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      } catch (error) {
        console.error(`Error fetching products for category "${category}":`, error);
      }
    });
  });
}

async function fetchProducts() {
  const res = await fetch('https://dummyjson.com/products?limit=100');
  const data = await res.json();
  return data.products;
}

function renderProducts(products) {
  const container = document.querySelector('.cards .grid');
  container.innerHTML = products.map(product => `
    <div class="product-card relative rounded-2xl shadow-lg p-4 bg-white max-w-xs" data-id="${product.id}">
      <div class="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-primary text-xl add-to-love">
        <i class="fa-regular fa-heart"></i>
      </div>
      <img src="${product.thumbnail}" alt="${product.title}" class="w-full object-cover rounded-lg mb-4" />
      <h2 class="text-lg font-bold text-gray-800 mb-2">${product.title}</h2>
      <p class="text-gray-600 text-sm mb-3">${product.description.substring(0, 50)}...</p>
      <div class="flex items-center justify-between">
        <span class="text-primary font-semibold text-xl">$${product.price}</span>
        <button class="add-to-cart bg-primary text-white px-4 cursor-pointer hover:bg-black py-2 rounded-lg hover:bg-secondary transition duration-200">Add to Cart</button>
      </div>
    </div>
  `).join('');

  attachCardListeners();
}

function attachCardListeners() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      const id = card.dataset.id;
      if (!cartItems.includes(id)) {
        cartItems.push(id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCounters();
      }
    });
  });

  document.querySelectorAll('.add-to-love').forEach(icon => {
    icon.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      const id = card.dataset.id;
      if (!loveItems.includes(id)) {
        loveItems.push(id);
        localStorage.setItem('wishlist', JSON.stringify(loveItems));
        updateCounters();
      }
    });
  });
}

function updateCounters() {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let loveItems = JSON.parse(localStorage.getItem('wishlist')) || [];

  const cartCounter = document.getElementById("number-card");
  const loveCounter = document.getElementById("number-heart");

  if (cartCounter) {
    cartCounter.textContent = cartItems.length;
  }

  if (loveCounter) {
    loveCounter.textContent = loveItems.length;
  }
}


fetchCategories().then(renderTabs);
fetchProducts().then(renderProducts);
















