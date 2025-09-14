const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

// Render register page
exports.renderUserRegister = (req, res) => {
  res.render("user/register", { error: null });
};

// Handle user register
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("user/register", { error: "All fields are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.render("user/register", {
        error: "Email already registered.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "buyer", // 👈 fixed role
    });

    res.redirect("/login");
  } catch (err) {
    console.error("User register error:", err);
    res.render("user/register", { error: "Server error, try again." });
  }
};

// Render login page (shared for all roles)
exports.renderLogin = (req, res) => {
  res.render("login", { error: null });
};

// Handle login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", { error: "All fields required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).render("login", { error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render("login", { error: "Invalid credentials." });
    }

    // Save session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    console.log(`✅ Login successful: ${user.email} (${user.role})`);

    // Redirect based on role
    if (user.role === "seller") {
      return res.redirect("seller/dashboard");
    } else if (user.role === "buyer") {
      return res.redirect("/");
    } else if (user.role === "admin") {
      return res.redirect("admin/dashboard");
    }

    // Fallback (just in case)
    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", { error: "Server error, try again." });
  }
};

// Logout (shared for all roles)
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("login");
  });
};

// // Handle user login

// exports.userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.render("user/login", { error: "All fields required." });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       role: "buyer",
//     });
//     if (!user) {
//       return res.render("user/login", { error: "Invalid credentials." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.render("user/login", { error: "Invalid credentials." });
//     }

//     // Save session
//     req.session.userId = user._id;
//     req.session.userRole = "buyer";

//     console.log("✅ User login successful:", user.email);
//     res.redirect("/user/dashboard");
//   } catch (err) {
//     console.error("User login error:", err);
//     res.render("user/login", { error: "Server error, try again." });
//   }
// };

// Dashboard for user
exports.userDashboard = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);

    res.render("user/dashboard", { products });
  } catch (err) {
    console.error("User dashboard error:", err);
    res.status(500).send("Error loading user dashboard");
  }
};

//get user address form for shipping

// Show address form
exports.getAddressForm = (req, res) => {
  res.render("addressForm", { user: req.user });
};

// Save or update address
exports.saveAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;

    const user = await User.findById(req.user._id);
    user.address = { name, phone, address, city, state, pincode };
    await user.save();

    // After saving, go back to checkout
    res.redirect("/orders/checkout");
  } catch (err) {
    console.error("Save address error:", err);
    res.status(500).send("server error");
  }
};
