const currentImg = document.querySelector("#main-image-scent");
const collectionImgs = document.querySelectorAll(".card-imgs-collection");

collectionImgs.forEach((img) => {
  img.addEventListener("click", function (e) {
    const url = img.src;
    currentImg.src = url;
  });
});
