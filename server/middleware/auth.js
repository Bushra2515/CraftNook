// // middleware/auth.js
// exports.isAuthenticated = (req, res, next) => {
//   if (!req.session.userId) {
//     return res.redirect("/login"); // default fallback
//   }
//   next();
// };

// // Allow only buyers
// exports.isBuyer = (req, res, next) => {
//   if (req.session.userRole !== "buyer") {
//     return res.status(403).send("Access denied. Buyer only.");
//   }
//   next();
// };

// // Allow only sellers
// exports.isSeller = (req, res, next) => {
//   if (req.session.userRole !== "seller") {
//     return res.status(403).send("Access denied. Seller only.");
//   }
//   next();
// };

// // Allow only admins
// exports.isAdmin = (req, res, next) => {
//   if (req.session.userRole !== "admin") {
//     return res.status(403).send("Access denied. Admin only.");
//   }
//   next();
// };
// middleware/auth.js
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login"); // fallback if not logged in
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }
    req.user = user; // ✅ attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).send("Server error");
  }
};

// Allow only buyers
exports.isBuyer = (req, res, next) => {
  if (!req.user || req.user.role !== "buyer") {
    return res.status(403).send("Access denied. Buyer only.");
  }
  next();
};

// Allow only sellers
exports.isSeller = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).send("Access denied. Seller only.");
  }
  next();
};

// Allow only admins
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Access denied. Admin only.");
  }
  next();
};
