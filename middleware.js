const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema, productSchema, brandSchema } = require("./schemas.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  } else {
    return next();
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.username === "admin") {
    return next();
  } else {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect("/products");
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  console.log(req.user._id.equals(review.author._id));
  if (req.user._id.equals(review.author._id)) {
    return next();
  } else {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/products/${id}`);
  }
};

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.validateBrand = (req, res, next) => {
  const { error } = brandSchema.validate(req.body.brand);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};
