const parent = document.querySelector(".parent");
const items = document.querySelectorAll(".product");
const totals = document.querySelector(".totals");

items.forEach(function (item) {
  item.addEventListener("click", function (event) {
    item.classList.add("selected");
    const delBtn = document.querySelector(".selected .delete-item");
    const addBtn = document.querySelector(".selected .update-item");
    const qty = document.querySelector(".selected .qty");
    const size = document.querySelector(".selected .size").textContent;
    const id = item.id;

    if (event.target === delBtn) {
      //DELETE ITEMS FROM THE CART
      axios
        .post("/cart/delete", {
          id,
          size,
        })
        .then((response) => response.data)
        .then((data) => {
          totals.textContent = `total: £${data.totals}`;
          document.querySelector("#cart-items").textContent = data.numOfItems;
        })
        .catch((e) => console.log(e));
      parent.removeChild(item);
    } else if (event.target === addBtn) {
      //UPDATE THE CART
      const changedQty = qty.value;
      //const id = item.id;
      axios
        .post("/cart/update", { changedQty, id, size })
        .then((response) => response.data)
        .then((data) => {
          totals.textContent = `total: £${data.totals}`;
          document.querySelector("#cart-items").textContent = data.numOfItems;
        })

        .catch((err) => {
          if (err.response) {
            if (err.response.status === 500) {
              alert("Something went wrong please try again");
              url = "/cart/show";
              location.href = url;
            } else if (err.response.status === 404) {
              url = "/products";
              location.href = url;
            } else {
              url = "/cart/show";
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
    }
    item.classList.remove("selected");
  });
});
