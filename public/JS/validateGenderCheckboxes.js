const checkFemale = document.querySelector(".checkFemale");
const checkMale = document.querySelector(".checkMale");
const checkUnisex = document.querySelector(".checkUnisex");
const checkboxes = document.querySelectorAll('.gender input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function (e) {
    const isCheckboxChecked = checkFemale.checked || checkMale.checked || checkUnisex.checked;
    if (isCheckboxChecked) {
      for (let checkbox of checkboxes) {
        checkbox.required = false;
      }
    }
    if (!isCheckboxChecked) {
      for (let checkbox of checkboxes) {
        checkbox.required = true;
      }
    }
  });
});
