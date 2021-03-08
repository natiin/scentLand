const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const Product = require("./product.js");
const { cloudinary } = require("../cloudinary");

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const BrandSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [ImageSchema],

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
BrandSchema.pre("validate", function (next) {
  if (this.images.length > 2) throw new ExpressError("You can upload up to two image files!", 400);
  return next();
});

BrandSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Product.deleteMany({
      _id: {
        $in: doc.products,
      },
    });
  }
  if (doc.images) {
    for (let img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model("Brand", BrandSchema);
