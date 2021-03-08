const form = document.querySelector(".form-img-validate");
const input = document.querySelector(".image-validate");

form.addEventListener("submit", function (event) {
  let isTooBig = checkSize(input);
  let filesNum = input.files.length;
  checkImgs(event, isTooBig, filesNum);
});

input.addEventListener("change", function (event) {
  let isTooBig = checkSize(event.target);
  let filesNum = event.target.files.length;
  checkImgs(event, isTooBig, filesNum);
});

function checkImgs(event, isTooBig, filesNum) {
  if (isTooBig || filesNum > 2) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector(".images-fail").classList.remove("d-none");
    input.value = null;
  } else {
    document.querySelector(".images-fail").classList.add("d-none");
  }
}

function checkSize(input) {
  let sizeExceeded = false;
  for (let file of input.files) {
    if (file.size > 500000) {
      sizeExceeded = true;
      break;
    }
  }
  return sizeExceeded;
}
