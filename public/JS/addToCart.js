const options = document.querySelectorAll(".price-box");
const addToBagBtn = document.querySelector(".add-to-bag-btn");
const basket = document.querySelector("#cart");
const productID = document.querySelector("#product-show-page").dataset.productId;

options.forEach((option) => {
  //adds 'selected-price-option' class to the chosen option
  option.addEventListener("click", function (e) {
    const selected = document.querySelectorAll(".selected-price-option");
    for (let select of selected) {
      select.classList.remove("selected-price-option");
    }
    this.classList.toggle("selected-price-option");
  });
});

addToBagBtn.addEventListener("click", function (e) {
  basket.classList.add("filled-basket");

  const sizes = document.querySelector(".selected-price-option .size");
  const prices = document.querySelector(".selected-price-option .price");

  //retrieves size and price for each selected option
  size = retnum(sizes.textContent);
  price = retnum(prices.textContent);
  const product = { size, price };

  function retnum(str) {
    const num = str.replace(/[^0-9]/g, "");
    return parseInt(num, 10);
  }

  // const productShow = JSON.stringify(product);
  // const productID = productShow._id;
  const response = axios
    .post("/cart", { product, productID }) //sends info about products to the server
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      document.querySelector("#cart-items").textContent = data;

      const success = document.querySelector(".success"); // displays success alert to the client
      success.innerHTML = `
      <div class="container mt-2">
        <div class="row">
          <div class="col-6 offset-3">
            <div class="alert alert-primary alert-dismissible fade show" role="alert">
              <strong>added to the cart</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>`;
      return;
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 500) {
          alert("Something went wrong please try again");
          url = `/products/${productID}`;
          location.href = url;
        } else if (err.response.status === 404) {
          url = "/products";
          location.href = url;
        } else {
          url = `/products/${productID}`;
          location.href = url;
        }
        console.log(err.response, "err.response");
      } else if (err.request) {
        console.log(err.request);
        alert("Please check your network connection");
      } else {
        console.log(err, "err");
      }
    });
});
