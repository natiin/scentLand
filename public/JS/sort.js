const sorter = document.querySelector("#sorter");
sorter.addEventListener("change", function (e) {
  const option = e.target.value;
  if (option === "1") {
    sortList("asc", "price");
  } else if (option === "2") {
    sortList("desc", "price");
  } else if (option === "3") {
    sortList("asc", "name");
  } else if (option === "4") {
    sortList("desc", "name");
  }
});

function sortList(option, target = "price") {
  const parentContainer = document.querySelector(".sort-container");
  let switching = true;
  let shouldSwitch;
  while (switching) {
    switching = false;
    const childEl = parentContainer.querySelectorAll(".item"); //item = product
    for (i = 0; i < childEl.length - 1; i++) {
      shouldSwitch = false;
      let a;
      let b;

      if (target === "price") {
        a = parseInt(childEl[i].querySelector("li[data-price]").dataset.price);
        b = parseInt(childEl[i + 1].querySelector("li[data-price]").dataset.price);
      } else if (target === "name") {
        a = childEl[i].querySelector(".brand").textContent;
        b = childEl[i + 1].querySelector(".brand").textContent;
      }
      option === "asc" ? (selection = a > b) : (selection = a < b);

      if (selection) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      childEl[i].parentNode.insertBefore(childEl[i + 1], childEl[i]);
      switching = true;
    }
  }
}
