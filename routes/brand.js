const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, isAdmin, validateBrand } = require("../middleware.js");
const brands = require("../controllers/brands");
const multer = require("multer"); //handling multipart/form-data, image files
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", catchAsync(brands.index));
router.get("/new", isLoggedIn, isAdmin, brands.newForm);

router.get("/:id/edit", isLoggedIn, isAdmin, catchAsync(brands.editForm));
router.get("/:id", catchAsync(brands.show));
router.post("/", isLoggedIn, isAdmin, upload.array("brand[image]"), validateBrand, catchAsync(brands.createNewBrand));
router.put("/:id/", isLoggedIn, isAdmin, upload.array("brand[image]"), validateBrand, catchAsync(brands.updateBrand));
router.delete("/:id", isLoggedIn, isAdmin, catchAsync(brands.deleteBrand));

module.exports = router;
