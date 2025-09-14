const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "yoursecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

//view engine and static files
app.set("view engine", "ejs");
//since app.js is in server/, views are in server/viewa
app.set("views", path.join(__dirname, "views"));
//serve public/ which is one level up from server
app.use(express.static(path.join(__dirname, "..", "public")));

//serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//for getting static for public folder
app.use(express.static("public"));
//models
const Product = require("./models/Product");

//get the index page
//const Product already done above

app.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("seller", "name");
    console.log("products send to view:", products.length);
    // res.render("index", { products });
    // , user: req.user
    res.render("index", { products });
  } catch (err) {
    console.error("Error loading home page:", err);
    res.render("index", { products: [] });
  }
});

// // Routes
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const UserAuthRoutes = require("./routes/userAuth");
const SellerAuthRoutes = require("./routes/sellerAuth");
const cartRoutes = require("./routes/cart");

app.use("/orders", orderRoutes);
app.use("/", productRoutes);
app.use("/", UserAuthRoutes);
app.use("/", SellerAuthRoutes);
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

//page routes ejs rendering
// app.get("/", async (req, res) => {
//   try {
//     const products = await product.find().limit(12).lean(); //propfind() fetches all product from mongo db
//     //limit(12) only returns first 12
//     // lean - plain objects for ejs converts mongodb documents into plain js objects for faster read
//     res.render("index", { Product });
//   } catch (err) {
//     console.error(err); // send data to json if successful and send s http 500 error if something goes wrong
//     res.status(500).send("server error");
//   }
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
