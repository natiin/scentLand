const Product = require("../models/product");
const Brand = require("../models/brand");
const ExpressError = require("../utils/ExpressError.js");
const sortPrices = require("../utils/sortPrices.js");

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const products = await Product.find({}).populate("reviews");
  sortPrices(products);
  res.render("products/index", { products });
};

module.exports.newForm = async (req, res) => {
  const brands = await Brand.find({});
  res.render("products/new", { brands });
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({ path: "reviews", populate: { path: "author" } });
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/products");
  }
  product.sortInsidePrices();

  res.render("products/show", { product });
};

module.exports.createNewProduct = async (req, res, next) => {
  for (let imgSize of req.files) {
    if (imgSize.size > 500000) {
      return next(new ExpressError("File exceeded maximum size", 400));
    }
  }
  const productBrandName = req.body.name.brand;
  const brand = await Brand.findOne({ name: productBrandName });
  const product = new Product(req.body);

  const handleNotes = (notes) => {
    return notes
      .split(",")
      .map((note) => note.trim())
      .filter((note) => note !== "");
  };

  product.notes.topNotes = handleNotes(req.body.notes.topNotes);
  product.notes.middleNotes = handleNotes(req.body.notes.middleNotes);
  product.notes.baseNotes = handleNotes(req.body.notes.baseNotes);

  product.images = req.files.map((image) => ({ url: image.path, filename: image.filename }));
  await brand.products.push(product);
  await product.save();
  await brand.save();
  req.flash("success", "Product successfully added");
  res.redirect(`/products/${product._id}`);
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const brands = await Brand.find({});
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/products");
  }
  res.render("products/edit", { product, brands });
};

module.exports.updateProduct = async (req, res, next) => {
  for (let imgSize of req.files) {
    if (imgSize.size > 500000) {
      return next(new ExpressError("File exceeded maximum size", 400));
    }
  }
  const { id } = req.params;
  const productBefore = await Product.findById(id);
  const product = await Product.findByIdAndUpdate(id, req.body);
  const brand = await Brand.findOne({ name: productBefore.name.brand });
  if (brand.name !== req.body.name.brand) {
    await Brand.findByIdAndUpdate(brand._id, { $pull: { products: product._id } });
    const changedBrand = await Brand.findOne({ name: req.body.name.brand });
    changedBrand.products.push(product);
    await changedBrand.save();
  }

  const newImages = req.files.map((image) => ({ url: image.path, filename: image.filename }));
  product.images.push(...newImages);
  await product.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Product successfully updated!");
  res.redirect(`/products/${product._id}`);
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const brandName = product.name.brand;
  const brand = await Brand.findOne({ name: brandName });
  await Brand.findByIdAndUpdate(brand._id, { $pull: { products: id } });
  await Product.findByIdAndDelete(id);
  res.redirect("/products/admin");
};

module.exports.mensProducts = async (req, res) => {
  const products = await Product.find({ gender: "male" }).populate("reviews");
  sortPrices(products);
  res.render("products/mens", { products });
};

module.exports.womensProducts = async (req, res) => {
  const products = await Product.find({ gender: "female" }).populate("reviews");
  sortPrices(products);
  res.render("products/womens", { products });
};

module.exports.admin = async (req, res) => {
  const products = await Product.find({});
  const brands = await Brand.find({});
  res.render("products/admin", { products, brands });
};

module.exports.sale = async (req, res) => {
  const products = await Product.find({
    "prices.salePrice": { $gte: 1 },
  }).populate("reviews");

  sortPrices(products);

  res.render("products/sale", { products });
};

module.exports.search = async (req, res) => {
  const data = req.body.input.trim();
  const brand = await Brand.find({ name: data }).collation({ locale: "en", strength: 2 });
  const products = await Product.find()
    .or([{ "name.brand": data }, { "name.title": { $regex: data, $options: "i" } }, { gender: data }, { "notes.topNotes": data }, { "notes.middleNotes": data }, { "notes.baseNotes": data }])
    .collation({ locale: "en", strength: 2 });

  res.json({ products, brand });
};

module.exports.offers = (req, res) => {
  res.render("products/offers");
};
