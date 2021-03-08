const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const cart = require("../controllers/cart");

router.post("/", catchAsync(cart.addToCart));
router.post("/update", cart.updateCart);
router.post("/delete", cart.deleteItems);
router.get("/show", cart.showCart);

module.exports = router;
