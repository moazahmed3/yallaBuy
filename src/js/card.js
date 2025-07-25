const cartContainer = document.getElementById("cart-products");
const totalPriceElement = document.getElementById("total-price");
let cartItemIds = JSON.parse(localStorage.getItem('cart')) || [];


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
updateCounters()
if (cartContainer && totalPriceElement) getCartProducts();

async function getCartProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100');
    const data = await res.json();

    const cartProducts = data.products.filter(product =>
      cartItemIds.includes(String(product.id))
    );

    const quantities = {};
    cartProducts.forEach(p => quantities[p.id] = 1);

    renderCart(cartProducts, quantities);
  } catch (err) {
    console.error("Error loading cart products:", err);
  }
}

function renderCart(products, quantities) {
  cartContainer.innerHTML = products.map(product => `
    <div class="border p-4 rounded-lg shadow relative">
      <button class="remove-item absolute top-2 cursor-pointer hover:text-red-900 right-2 text-red-500 text-xl" data-id="${product.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
      <img src="${product.thumbnail}" class="w-full h-48 object-cover rounded mb-4" />
      <h3 class="text-xl font-semibold mb-2">${product.title}</h3>
      <p class="text-gray-600 mb-1">Price: $${product.price}</p>
      <div class="flex items-center gap-3 mt-2">
        <button class="decrease cursor-pointer hover:bg-primary bg-gray-200 px-2 py-1 rounded" data-id="${product.id}">-</button>
        <span class="font-bold quantity" id="qty-${product.id}">${quantities[product.id]}</span>
        <button class="increase cursor-pointer hover:bg-primary bg-gray-200 px-2 py-1 rounded" data-id="${product.id}">+</button>
      </div>
    </div>
  `).join('');

  attachQuantityListeners(products, quantities);
  attachRemoveListeners(products);
  calculateTotal(products, quantities);
}

function calculateTotal(products, quantities) {
  let total = 0;
  products.forEach(product => {
    total += product.price * quantities[product.id];
  });
  totalPriceElement.textContent = total.toFixed(2);
}

function attachQuantityListeners(products, quantities) {
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      quantities[id]++;
      document.getElementById(`qty-${id}`).textContent = quantities[id];
      calculateTotal(products, quantities);
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (quantities[id] > 1) {
        quantities[id]--;
        document.getElementById(`qty-${id}`).textContent = quantities[id];
        calculateTotal(products, quantities);
      }
    });
  });
}

function attachRemoveListeners(products) {
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const index = cartItemIds.indexOf(id);
      if (index !== -1) {
        cartItemIds.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItemIds));
        getCartProducts();
      }
    });
  });
}