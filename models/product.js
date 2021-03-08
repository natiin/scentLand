const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("./review.js");
const { cloudinary } = require("../cloudinary");

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const subSchema = new mongoose.Schema({
  size: Number,
  price: Number,
  isOnSale: { type: Boolean, default: false },
  salePrice: Number,
});

const ProductSchema = new mongoose.Schema({
  name: {
    brand: String,
    title: String,
  },
  description: String,
  notes: {
    topNotes: [String],
    middleNotes: [String],
    baseNotes: [String],
  },
  scent: String,
  gender: {
    type: [String],
    enum: ["female", "male", "unisex"],
  },
  launchYear: Number,
  type: {
    type: String,
    enum: ["EDT", "EDP"],
  },
  prices: [subSchema],

  images: [ImageSchema],

  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
ImageSchema.virtual("xs").get(function () {
  return this.url.replace("/upload", "/upload/w_100");
});
ImageSchema.virtual("fit").get(function () {
  return this.url.replace("/upload", "/upload/c_scale,h_300,w_225");
});

ProductSchema.pre("validate", function (next) {
  if (this.images.length > 2) throw new ExpressError("You can upload up to two image files!", 400);
  next();
});

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
  if (doc.images) {
    for (let img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});
ProductSchema.methods.sortInsidePrices = function () {
  this.prices.sort(function (e1, e2) {
    return e1.price - e2.price;
  });

  this.prices.sort(function (e1, e2) {
    e1.salePrice === null ? (e1.salePrice = e1.price) : e1.salePrice;
    e2.salePrice === null ? (e2.salePrice = e2.price) : e2.salePrice;
    return e1.salePrice - e2.salePrice;
  });
};

ProductSchema.methods.calculateAvgRating = function () {
  let ratingsTotal = 0;
  if (this.reviews.length) {
    this.reviews.forEach((review) => {
      ratingsTotal += review.rating;
    });
    this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
  } else {
    this.avgRating = ratingsTotal;
  }
  const floorRating = Math.round((this.avgRating + Number.EPSILON) * 10) / 10;

  return floorRating;
};

module.exports = mongoose.model("Product", ProductSchema);
