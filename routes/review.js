const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync.js");
const reviews = require("../controllers/reviews");

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, catchAsync(reviews.editForm));
router.route("/:reviewId").put(isLoggedIn, isReviewAuthor, validateReview, catchAsync(reviews.updateReview)).delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
