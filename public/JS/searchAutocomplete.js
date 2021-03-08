const searchInput = document.querySelector("#search-input");

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const onInput = (e) => {
  const input = e.target.value.trim();
  if (input && input.length) {
    fetchData(input)
      .then((response) => response.data)
      .then((data) => {
        displayResults(data);
      })
      .catch((e) => console.log(e));
  }
};
searchInput.addEventListener("input", debounce(onInput, 1000));
searchInput.addEventListener("input", function (e) {
  if (e.target.value === "") {
    cleanInput();
  }
});

function fetchData(input) {
  const response = axios
    .post("/products/search", {
      input,
    })
    .then((response) => {
      return response;
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response, "err.response");
      } else if (err.request) {
        console.log(err.request);
        alert("Please check your network connection");
      } else {
        console.log(err, "err");
      }
      createDropdownItem();
    });
  return response;
}

const displayResults = (data) => {
  cleanInput();
  let ul = document.querySelector(".dropdown-menu");

  if (data.products.length > 0 || data.brand.length > 0) {
    for (let product of data.products) {
      productOption = { show: `<img src=${product.images[0].url} class="search-result-img"> ${product.name.brand} ${product.name.title} ${product.type}`, href: `/products/${product._id}` };
      createDropdownItem(productOption);
    }

    for (let brand of data.brand) {
      brandOption = { show: `<img src=${brand.images[0].url} class="search-result-img"> ${brand.name}`, href: `/brands/${brand._id}` };
      createDropdownItem(brandOption);
    }
  }
  if (data.products.length === 0 && data.brand.length === 0) {
    createDropdownItem();
  }
  ul.ariaExpanded = true;
  ul.classList.add("show");
  ul.classList.add("search-result");
};

function cleanInput() {
  const ul = document.querySelector(".dropdown-menu");
  const lis = document.querySelectorAll(".dropdown-menu > li");

  if (lis && lis.length) {
    for (let li of lis) {
      ul.removeChild(li);
    }
    ul.ariaExpanded = false;
    ul.classList.remove("show");
    searchInput.value = null;
  }
}

document.body.addEventListener("click", function (e) {
  cleanInput();
});

function createDropdownItem(option) {
  let ul = document.querySelector(".dropdown-menu");
  let li = document.createElement("li");

  if (!option) {
    li.classList.add("dropdown-item");
    li.textContent = "No products found";
  }

  if (option) {
    let a = document.createElement("a");
    a.innerHTML = option.show;
    a.href = option.href;
    a.classList.add("dropdown-item");
    li.appendChild(a);
  }

  ul.appendChild(li);
}
