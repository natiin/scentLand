//AVERAGE - STARS DISPLAYING//
const avgRatings = document.querySelectorAll(".avgRat");
const average = document.querySelector(".average");

for (let avgRating of avgRatings) {
  average.textContent = `${avgRating.textContent}/5`; //displays average + number of votes/reviews show page only
  avgRating.innerHTML = fillStarsAvg(avgRating.textContent); //displays stars
}

function fillStarsAvg(num) {
  let arr = [];
  let fullStars = Math.floor(num);

  let halfStars = num % 1 > 0.4;

  for (let i = 0; i < fullStars; i++) {
    arr.push('<i class="bi bi-star-fill"></i>');
  }

  if (halfStars) {
    arr.push('<i class="bi bi-star-half"></i>');
  }

  if (halfStars) {
    for (let i = fullStars + 1; i < 5; i++) {
      arr.push('<i class="bi bi-star"></i>');
    }
  } else if (!halfStars) {
    for (let i = fullStars; i < 5; i++) {
      arr.push('<i class="bi bi-star"></i>');
    }
  }

  return arr.join("");
}
