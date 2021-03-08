const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, isAdmin, validateProduct } = require("../middleware.js");
const products = require("../controllers/products");
const multer = require("multer"); //handling multipart/form-data, image files
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/").get(catchAsync(products.index)).post(isLoggedIn, isAdmin, upload.array("image"), validateProduct, catchAsync(products.createNewProduct));

router.get("/new", isLoggedIn, isAdmin, catchAsync(products.newForm));

router.get("/:id/edit", isLoggedIn, isAdmin, catchAsync(products.editForm));
router.get("/mens", catchAsync(products.mensProducts));
router.get("/womens", catchAsync(products.womensProducts));
router.get("/admin", isLoggedIn, isAdmin, catchAsync(products.admin));
router.get("/sale", catchAsync(products.sale));
router.get("/offers", products.offers);

router.route("/:id").get(catchAsync(products.show)).put(isLoggedIn, isAdmin, upload.array("image"), validateProduct, catchAsync(products.updateProduct)).delete(isLoggedIn, isAdmin, catchAsync(products.deleteProduct));

router.post("/search", catchAsync(products.search));

module.exports = router;
