const placeOrderBtn = document.querySelector("#place-order-btn");

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", function () {
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    alert("✅ Success! Your order has been placed.");
    window.location = "../../index.html";
  });
}

