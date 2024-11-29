$(function () {
  $("header").load("header.html", function () {
    updateCartBadge(); // Update cart badge after loading header
  });
});

// Fetch API data and populate products
axios
  .get('https://fakestoreapiserver.reactbd.com/walmart')
  .then(response => {
    const responseData = response.data;
    let product = document.querySelector(".productsList");


    // Retrieve existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Render products
    for (let i = 0; i < responseData.length; i++) {
      console.log(responseData[i]);
      const { _id, title, des, oldPrice, price, brand, image } = responseData[i];
      product.innerHTML += `
        <div class="productcard">
          <img src="${image}" alt="">
          <div class="prodetails">
            <div class="title">${title}</div>
            <div class="brand">${brand}</div>
            <div class="description">${des}</div>
            <div class="price">Rs.
              <s>${oldPrice}</s> ${price}
            </div>
            <div class="add">
              <button class="add-to-cart" data-id="${_id}" 
                      data-title="${title}" 
                      data-price="${price}" 
                      data-image="${image}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>`;
    }

    // Add event listeners to "Add to Cart" buttons
    const cartbtns = document.querySelectorAll(".add-to-cart");

    cartbtns.forEach(button => {
      button.addEventListener("click", () => {
        // Get product details from the button
        const product = {
          id: button.dataset.id,
          title: button.dataset.title,
          price: button.dataset.price,
          image: button.dataset.image,
          quantity: 1, // Default quantity is 1
        };

        // Check if the product already exists in the cart
        const existingProduct = cartItems.find(item => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantity += 1; // Increment quantity
        } else {
          cartItems.push(product); // Add new product
        }

        // Save updated cart data to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Update cart badge
        updateCartBadge();
      });
    });
  })
  .catch(error => {
    console.error(error);
  });

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
