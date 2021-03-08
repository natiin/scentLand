const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username,
    });
    const registeredUser = await User.register(user, password);
    await registeredUser.save();
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "You have been successfully registered");
      const url = req.session.returnUrl || "/products";
      delete req.session.returnUrl;

      return res.redirect(url);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");

  if (req.session.cart) {
    user.cart = req.session.cart;
  } else if (!req.session.cart) {
    req.session.cart = user.cart;
  }
  req.flash("success", "Welcome back!");
  const url = req.session.returnUrl || "/products";
  delete req.session.returnUrl;

  res.redirect(url);
};

module.exports.logout = async (req, res) => {
  if (req.session.cart) {
    const cart = new Cart(req.session.cart);
    const user = await User.findById(req.user._id);
    user.cart = cart;
    await user.save();
  }

  req.logout();
  delete req.session.cart;
  req.flash("success", "Goodbye!");
  res.redirect("/products");
};

module.exports.myAccount = async (req, res) => {
  const user = await User.findById(req.user._id).populate("reviews");

  let products = await Product.find().populate({
    path: "reviews",
    match: { author: req.user._id },
  });

  products = products.filter((product) => product.reviews.length > 0);
  res.render("users/myAccount", { user, products });
};
