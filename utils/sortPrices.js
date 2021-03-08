function sortPrices(products) {
  for (let product of products) {
    product.sortInsidePrices();
  }
  return products;
}

module.exports = sortPrices;
