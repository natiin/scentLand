const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const users = require("../controllers/users");
const { isLoggedIn } = require("../middleware.js");
const User = require("../models/user");

router.route("/register").get(users.registerForm).post(catchAsync(users.register));

router
  .route("/login")
  .get(users.loginForm)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

router.get("/logout", catchAsync(users.logout));
router.get("/my-account", isLoggedIn, catchAsync(users.myAccount));

// router.get(
//   "/admin",
//   catchAsync(async (req, res) => {
//     const admin = new User({
//       username: "admin",
//     });
//     const registerAdmin = await User.register(admin, "admin");
//     await registerAdmin.save();
//     res.redirect("/products");
//   })
// );

module.exports = router;
