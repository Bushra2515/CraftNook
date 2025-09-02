// const express = require("express");
// const router = express.Router();
// const {
//   renderUserRegister,
//   renderUserLogin,
//   userRegister,
//   userLogin,
//   userLogout,
//   userDashboard,
// } = require("../controllers/userController");
// const { isAuthenticated, isBuyer } = require("../middleware/auth");

// // Register
// router.get("/user/register", renderUserRegister);
// router.post("/user/register", userRegister);

// // Login
// router.get("/user/login", renderUserLogin);
// router.post("/user/login", userLogin);

// // Logout
// router.get("/user/logout", userLogout);

// // Dashboard (only buyers)
// router.get("/user/dashboard", isAuthenticated, isBuyer, userDashboard);

// module.exports = router;
