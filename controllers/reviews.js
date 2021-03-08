const Review = require("../models/review");
const Product = require("../models/product");
const User = require("../models/user");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const date = new Date();
  const user = await User.findById(req.user._id);
  const product = await Product.findById(id);
  const review = new Review(req.body);
  review.date = date;
  review.edited.edited = false;
  review.edited.date = date;
  review.author = req.user._id;
  product.reviews.push(review);
  user.reviews.push(review);
  await user.save();
  await review.save();
  await product.save();
  req.flash("success", "Review successfully added!");
  res.redirect(`/products/${product._id}`);
};

module.exports.editForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  const product = await Product.findById(id);
  res.render("reviews/edit", { review, product });
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const date = new Date();
  const product = await Product.findById(id);
  const review = await Review.findByIdAndUpdate(reviewId, req.body);
  review.edited.edited = true;
  review.edited.date = date;
  await review.save();
  res.redirect(`/products/${product._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await User.findByIdAndUpdate(req.user._id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review successfully deleted!");
  res.redirect(`/products/${id}`);
};
