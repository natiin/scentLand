//WRITING A REVIEW - STARS //

const stars = document.querySelectorAll('.stars>.bi');
let arr = Array.from(stars);

let indx = Number;
for (let star of stars) {
	star.addEventListener('click', function(e) {
		indx = arr.indexOf(star) + 1; // stars count from 1 not 0
		document.querySelector('#rating').value = indx;

		return fillStars(indx);
	});
}

function fillStars(index) {
	for (let i = 0; i < index; i++) {
		stars[i].classList.remove('bi-star');
		stars[i].classList.add('bi-star-fill');
	}
	for (let i = index; i < 5; i++) {
		stars[i].classList.remove('bi-star-fill');
		stars[i].classList.add('bi-star');
	}
}
