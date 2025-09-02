const express = require("express");
const router = express.Router();
const {
  renderUserRegister,
  renderLogin,
  userRegister,
  loginUser,
  logoutUser,
  userDashboard,
} = require("../controllers/userController");
const { isAuthenticated, isBuyer } = require("../middleware/auth");

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

module.exports = router;
