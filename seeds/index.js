const mongoose = require("mongoose");
const products = require("./seeds.json");
const brands = require("./brands.json");
const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const dbURL = process.env.DB_URL;


mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection db error"));
db.once("open", () => {
  console.log("Database connected");
});

// const seedDB = async () => {
// 	await Product.deleteMany({});
// 	for (let i = 0; i < products.length; i++) {
// 		const product = new Product({
// 			name: { title: products[i].name.title },
// 			description: products[i].description,
// 			notes: {
// 				topNotes: products[i].notes.topNotes,
// 				middleNotes: products[i].notes.middleNotes,
// 				baseNotes: products[i].notes.baseNotes
// 			},
// 			scent: products[i].scent,
// 			gender: products[i].gender,
// 			launchYear: products[i].launchYear,
// 			type: products[i].type.toUpperCase(),
// 			price: { size: products[i].price.size, price: products[i].price.price },
// 			images: [
// 				{ url: products[i].url, filename: products[i].filename }
// 			]
// 		});

// 		await product.save();
// 	}
// };

const seedDB = async () => {
  await Product.deleteMany({});

  for (let i = 0; i < products.length; i++) {
    const productBrandName = products[i].name.brand;
    let size = [30, 50, 100];

    let randomPrice30 = Math.floor(Math.random() * (35 - 20)) + 20;
    let randomPrice50 = Math.floor(Math.random() * (55 - 36)) + 36;
    let randomPrice100 = Math.floor(Math.random() * (85 - 56)) + 56;
    const brand = await Brand.findOne({ name: productBrandName });
    const product = new Product({
      name: { brand: products[i].name.brand, title: products[i].name.title },
      description: products[i].description,
      notes: {
        topNotes: products[i].notes.topNotes,
        middleNotes: products[i].notes.middleNotes,
        baseNotes: products[i].notes.baseNotes,
      },
      scent: products[i].scent,
      gender: products[i].gender,
      launchYear: products[i].launchYear,
      type: products[i].type.toUpperCase(),
      prices: [
        { size: size[0], price: randomPrice30 },
        { size: size[1], price: randomPrice50 },
        { size: size[2], price: randomPrice100 },
      ],
      images: products[i].images,
    });

    await product.save();
    brand.products.push(product);
    await brand.save();
  }
};

seedDB().then(() => mongoose.connection.close());
