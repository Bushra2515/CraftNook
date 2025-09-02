const express = require("express");
const router = express.Router();

//for seller dashboard and register
const {
  renderSellerRegister,
  registerSeller,
  renderSellerDashboard,
  getSellerProfile,
} = require("../controllers/sellerController");

//for login from user controller
const {
  loginUser,
  logoutUser,
  renderLogin,
} = require("../controllers/userController");

//managing products
const {
  renderAddProduct,
  addProduct,
  uploadMiddleware,
  renderEditProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Register
router.get("/seller/register", renderSellerRegister);
router.post("/seller/register", registerSeller);

// Login
router.get("/login", renderLogin);
router.post("/login", loginUser);

// Dashboard
router.get("/seller/dashboard", renderSellerDashboard);

router.get("/logout", logoutUser);

//add product
router.get("/seller/addproduct", renderAddProduct);
router.post("/seller/addproduct", uploadMiddleware, addProduct); //NOTICE upload.single("image") middleware added here

//edit product
router.get("/seller/edit/:id", renderEditProduct);
router.post("/seller/edit/:id", uploadMiddleware, updateProduct);

//delete product
router.get("/seller/delete/:id", deleteProduct);

//getting seller profile
router.get("/seller/:id", getSellerProfile);

module.exports = router;
