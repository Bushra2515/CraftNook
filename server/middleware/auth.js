// middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login"); // default fallback
  }
  next();
};

// Allow only buyers
exports.isBuyer = (req, res, next) => {
  if (req.session.userRole !== "buyer") {
    return res.status(403).send("Access denied. Buyer only.");
  }
  next();
};

// Allow only sellers
exports.isSeller = (req, res, next) => {
  if (req.session.userRole !== "seller") {
    return res.status(403).send("Access denied. Seller only.");
  }
  next();
};

// Allow only admins
exports.isAdmin = (req, res, next) => {
  if (req.session.userRole !== "admin") {
    return res.status(403).send("Access denied. Admin only.");
  }
  next();
};
