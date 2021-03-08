// NEW AND EDIT FORM OF THE PRODUCT (handles prices for different size options)

const prices = document.querySelector(".prices-wrapper");
const delMoreSizes = document.querySelector(".del-more-sizes");

prices.addEventListener("click", function (e) {
  //adds an input for sale price
  const isOnSaleAll = document.querySelectorAll(".is-on-sale");
  const regularPriceAll = document.querySelectorAll(".regular-price");
  const salePriceAll = document.querySelectorAll(".sale-price");
  const salePricesInputs = document.querySelectorAll(".sale-price-input");

  if (e.target !== e.currentTarget) {
    if (Array.from(e.target.classList).includes("is-on-sale")) {
      const indx = Array.from(isOnSaleAll).indexOf(e.target); //indx of radio btns
      salePriceAll[indx].classList.remove("d-none");
      salePricesInputs[indx].required = true;
    } else if (Array.from(e.target.classList).includes("regular-price")) {
      const indx = Array.from(regularPriceAll).indexOf(e.target);
      salePriceAll[indx].classList.add("d-none");
      salePricesInputs[indx].required = false;
      salePricesInputs[indx].value = null;
    }
  }
});

const addMoreSizesBtn = document.querySelector(".more-sizes");

addMoreSizesBtn.addEventListener("click", function (e) {
  // adds extra size options
  e.preventDefault();
  const priceWrappers = document.querySelectorAll(".price-wrapper");
  const indx = priceWrappers.length;
  const newColumnPrice = document.createElement("div");
  newColumnPrice.innerHTML = `
    <div class="row mb-1">
    <label for="size-${indx}" class="form-label">Size ml</label>
    <input class="form-control w-50" type="text" id="size-${indx}" name="prices[${indx}][size]" required>
    </div>
    <div class="row mb-1">
    <label for="price-${indx}" class="form-label">Price £</label>
    <input class="form-control w-50" type="text" id="price-${indx}" name="prices[${indx}][price]" required>
    </div>
            
    <div class="form-check mb-1">
    <input class="form-check-input is-on-sale" type="radio" id="onsale-${indx}-radio" name="prices[${indx}][isOnSale]" value="true" required>
    <label class="form-check-label" for="onsale-${indx}-radio">on sale</label>
    </div>
    <div class="form-check mb-1">
    <input class="form-check-input regular-price" type="radio" id="regularprice-${indx}-radio" name="prices[${indx}][isOnSale]" value="false" required>
    <label class="form-check-label" for="regularprice-${indx}-radio">regular price</label>
    </div>
    <div class="sale-price d-none mb-1 row">
    <label for="saleprice-${indx}" class="form-label">Sale Price £</label>
    <input class="form-control w-50 sale-price-input" type="text" id="saleprice-${indx}" name="prices[${indx}][salePrice]">
    </div>
`;

  newColumnPrice.classList.add("price-wrapper", "col-4", "mb-4");
  prices.appendChild(newColumnPrice);
});

delMoreSizes.addEventListener("click", function (e) {
  // hides not needed size options
  e.preventDefault();
  const priceWrappers = document.querySelectorAll(".price-wrapper");
  const indx = priceWrappers.length - 1;
  const parent = document.querySelector(".prices-wrapper");

  if (indx !== 0) {
    parent.removeChild(priceWrappers[indx]);
  }
});
