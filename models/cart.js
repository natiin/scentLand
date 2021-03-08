const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  items: [],
  totals: Number,
});

CartSchema.methods.calculateTotals = function () {
  this.totals = 0;
  this.items.forEach((item) => {
    let price = item.price;
    let salePrice = item.salePrice;
    let qty = item.qty;
    let amount = salePrice === 0 ? price * qty : salePrice * qty;
    this.totals += amount;
  });
};

CartSchema.methods.numOfItems = function () {
  let sum = 0;
  for (let item of this.items) {
    sum = sum + item.qty;
  }
  return sum;
};
CartSchema.methods.addToCart = function (foundProduct, product) {
  let prod = {
    id: foundProduct._id,
    title: foundProduct.name.title,
    brand: foundProduct.name.brand,
    price: product.price,
    salePrice: product.isOnSale ? product.salePrice : 0,
    size: product.size,
    qty: 1,
    image: foundProduct.images[0].url,
  };
  for (let item of this.items) {
    if (item.id != prod.id) {
      continue;
    } else if (item.id == prod.id && item.size == prod.size) {
      let qty = item.qty + 1;
      this.updateCart(qty, item.id, item.size);
      this.calculateTotals();
      return;
    }
  }

  this.items.push(prod);
  this.calculateTotals();
};

CartSchema.methods.removeFromCart = function (id = 0, size) {
  for (let i = 0; i < this.items.length; i++) {
    let item = this.items[i];
    if (item.id === id && item.size === size) {
      this.items.splice(i, 1);
      this.calculateTotals();
    }
  }
};

CartSchema.methods.updateCart = function (qty, id, size) {
  for (let i = 0; i < this.items.length; i++) {
    let item = this.items[i];
    if (item.id === id && qty >= 1 && item.size === size) {
      item.qty = qty;
    }
  }
  this.calculateTotals();
};

CartSchema.methods.saveCart = function (req) {
  if (req.session) {
    req.session.cart = this;
  }
};
module.exports = mongoose.model("Cart", CartSchema);
