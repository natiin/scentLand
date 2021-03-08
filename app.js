if (process.env.NODE_ENV !== "production") {
  //console.log(process.env.SECRET); mamy dostep do sekretu w kazdym pliku

  require("dotenv").config();
}
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/users");
const brandRoutes = require("./routes/brand");
const otherRoutes = require("./routes/other");
const cartRoutes = require("./routes/cart");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport"); //plugin multiple strategies for authenication
const mongoSanitize = require("express-mongo-sanitize");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const User = require("./models/user");
const Cart = require("./models/cart");
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/shop";

const MongoStore = require("connect-mongo").default;

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

const secret = process.env.SECRET || "thisissecret";
const store = MongoStore.create({
  mongoUrl: dbURL,
  secret,
  touchAfter: 24 * 3600,
});
store.on("error", function (e) {
  console.log("Session store error", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const scriptSrcUrls = ["https://cdn.jsdelivr.net"];
const styleSrcUrls = ["https://cdn.jsdelivr.net", "https://fonts.googleapis.com/"];
const fontSrcUrls = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/dxhrxhiwb/", "https://images.unsplash.com/"],
      manifestSrc: ["'self'"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/////////////////ROUTES/////////////////

app.use((req, res, next) => {
  if (!["/login", "/register"].includes(req.originalUrl)) {
    req.session.returnUrl = req.originalUrl;
  }

  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  if (req.session.cart) {
    let cart = new Cart(req.session.cart);
    let num = cart.numOfItems();
    res.locals.numOfItems = num;
  } else {
    res.locals.numOfItems = "";
  }
  return next();
});

app.use("/brands", brandRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/help", otherRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  return res.render("home");
});

app.all("*", (req, res, next) => {
  //next(new ExpressError("Page not found", 404));
  return res.redirect("/");
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  return res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server starts");
});
