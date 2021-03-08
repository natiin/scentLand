const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.showCart = (req, res) => {
  const products = req.session.cart ? req.session.cart.items : {};
  const totals = req.session.cart ? req.session.cart.totals : {};
  res.render("users/cart", { products, totals });
};

module.exports.addToCart = async (req, res) => {
  const { product, productID } = req.body;
  const foundProduct = await Product.findById(productID);
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.addToCart(foundProduct, product);
  cart.saveCart(req);
  const numOfItems = cart.numOfItems();
  res.json(numOfItems);
};

module.exports.updateCart = (req, res) => {
  let { changedQty, id, size } = req.body;
  const cart = new Cart(req.session.cart);
  changedQty = parseInt(changedQty);
  size = parseInt(size);
  cart.updateCart(changedQty, id, size);
  cart.saveCart(req);
  totals = cart.totals;
  const numOfItems = cart.numOfItems();
  res.json({ totals, numOfItems });
};

module.exports.deleteItems = (req, res) => {
  const { id, size } = req.body;
  const cart = new Cart(req.session.cart);
  cart.removeFromCart(id, parseInt(size));
  cart.saveCart(req);
  totals = cart.totals;
  const numOfItems = cart.numOfItems();
  res.json({ totals, numOfItems });
};
