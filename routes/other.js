const express = require("express");
const router = express.Router();
const other = require("../controllers/other");

router.get("/contact", other.contact);
router.get("/delivery", other.delivery);
router.get("/returns", other.returns);

module.exports = router;
