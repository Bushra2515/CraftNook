const express = require("express");
const router = express.Router();
const {
  renderUserRegister,
  renderLogin,
  userRegister,
  loginUser,
  logoutUser,
  userDashboard,
  saveAddress,
  getAddressForm,
} = require("../controllers/userController");
const { isAuthenticated, isBuyer } = require("../middleware/auth");
const { route } = require("./order");

// Register
router.get("/user/register", renderUserRegister);
router.post("/user/register", userRegister);

// Login
router.get("login", renderLogin);
router.post("login", loginUser);

// Logout
router.get("logout", logoutUser);

// Dashboard (only buyers)
router.get("/user/dashboard", isAuthenticated, isBuyer, userDashboard);

//get address form
router.get("/user/address", isAuthenticated, isBuyer, getAddressForm);

router.post("/user/address", isAuthenticated, isBuyer, saveAddress);

module.exports = router;
