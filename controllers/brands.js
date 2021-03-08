const Brand = require("../models/brand");
const { cloudinary } = require("../cloudinary");
const ExpressError = require("../utils/ExpressError.js");

module.exports.newForm = (req, res) => {
  res.render("brands/new");
};

module.exports.createNewBrand = async (req, res, next) => {
  for (let imgSize of req.files) {
    if (imgSize.size > 500000) {
      return next(new ExpressError("File exceeded maximum size", 400));
    }
  }
  const brand = new Brand(req.body.brand);
  brand.images = req.files.map((image) => ({ url: image.path, filename: image.filename }));
  await brand.save();
  req.flash("success", "Brand successfully added");
  res.redirect(`/brands/${brand._id}`);
};

module.exports.index = async (req, res) => {
  const brands = await Brand.find({}).sort("name");
  res.render("brands/index", { brands });
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id).populate({ path: "products", populate: { path: "reviews" } });
  res.render("brands/show", { brand });
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    req.flash("error", "Brand not found");
    return res.redirect("/brands");
  }
  res.render("brands/edit", { brand });
};

module.exports.updateBrand = async (req, res, next) => {
  for (let imgSize of req.files) {
    if (imgSize.size > 500000) {
      return next(new ExpressError("File exceeded maximum size", 400));
    }
  }
  const { id } = req.params;
  const brand = await Brand.findByIdAndUpdate(id, req.body.brand);
  const newImages = req.files.map((image) => ({ url: image.path, filename: image.filename }));
  brand.images.push(...newImages);
  await brand.save();
  if (req.body.brand.deleteImages) {
    for (let filename of req.body.brand.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await brand.updateOne({ $pull: { images: { filename: { $in: req.body.brand.deleteImages } } } });
  }
  req.flash("success", "Brand successfully updated!");
  res.redirect(`/brands/${brand._id}`);
};

module.exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  await Brand.findByIdAndDelete(id);
  res.redirect("/products/admin");
};
