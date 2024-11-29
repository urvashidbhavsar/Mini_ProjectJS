$(function () {
  $("header").load("header.html", function () {
    updateCartBadge(); // Update cart badge after loading header
  });
});

// Retrieve cart data from localStorage
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartContainer = document.querySelector(".cart-container");
const totalContainer = document.querySelector(".cart-total");

// Function to render cart items
function renderCart() {
  cartContainer.innerHTML = ""; // Clear previous items
  let total = 0;

  if (cartItems.length > 0) {
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity; // Calculate total for each item
      total += itemTotal; // Add to the total bill

      cartContainer.innerHTML += `
        <div class="cart-item" data-index="${index}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <p>Price: Rs. ${item.price}</p>
            <p>
              Quantity: 
              <button class="quantity-btn decrement" data-action="decrement">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn increment" data-action="increment">+</button>
            </p>
            <p>Item Total: Rs. ${itemTotal}</p>
            <button class="remove-btn">&Cross;</button>
          </div>
        </div>`;
    });

    totalContainer.innerHTML = `<h3>Total Bill: Rs. ${total}</h3>`;
  } else {
    cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
    totalContainer.innerHTML = "";
  }

  // Save updated cart data to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Update cart badge
  updateCartBadge();
}

// Event listener for quantity changes and item removal
cartContainer.addEventListener("click", (event) => {
  const button = event.target;
  const index = button.closest(".cart-item").dataset.index;

  // Handle quantity changes
  if (button.classList.contains("quantity-btn")) {
    const action = button.dataset.action;

    if (action === "increment") {
      cartItems[index].quantity += 1; // Increment quantity
    } else if (action === "decrement" && cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1; // Decrement quantity (minimum 1)
    }
  }

  // Handle item removal
  if (button.classList.contains("remove-btn")) {
    cartItems.splice(index, 1); // Remove the item from the array
  }

  renderCart(); // Re-render cart
});

// Initial render
renderCart();

// Function to update cart icon with the total number of items
function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartBadge) {
    cartBadge.textContent = totalItems; // Update badge text
    cartBadge.style.display = totalItems > 0 ? "inline-block" : "none"; // Show badge only if items exist
  }
}
