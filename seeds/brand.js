const mongoose = require("mongoose");
const brands = require("./brands.json");
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
  console.log("Database connected!");
});

const seedDB = async () => {
  await Brand.deleteMany({});
  for (let i = 0; i < brands.length; i++) {
    const brand = new Brand({
      name: brands[i].name,
      description: brands[i].description,
      images: brands[i].images,
    });
    await brand.save();
  }
};
seedDB().then(() => mongoose.connection.close());
