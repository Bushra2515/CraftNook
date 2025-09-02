const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// 👉 Render seller register form
exports.renderSellerRegister = (req, res) => {
  res.render("seller/register", { error: null }); // no / before in render
};
// console.log("body", req.body);

// 👉 Handle seller registration
exports.registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      businessType,
      description,
      locationType,
      locationName,
      contact,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !businessName ||
      !businessType ||
      !description ||
      !locationType ||
      !locationName ||
      !contact
    ) {
      return res.render("seller/register", {
        error: "All fields are required.",
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.render("seller/register", {
        error: "Email already registered.",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create seller
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "seller", // fixed role
      sellerProfile: {
        businessName,
        businessType,
        description,
        contact,
        location: {
          type: locationType,
          name: locationType === "worldwide" ? "" : locationName,
        },
      },
    });

    res.redirect("/login");
  } catch (err) {
    console.error("❌ Seller register error:", err);
    res.render("seller/register", { error: "Server error, try again." });
  }
};

exports.renderSellerDashboard = async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== "seller") {
      return res.redirect("/login");
    }

    // Example stats
    const totalProducts = await Product.countDocuments({
      seller: req.session.userId,
    });
    const totalOrders = await Order.countDocuments({
      seller: req.session.userId,
    });
    const recentProducts = await Product.find({ seller: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.render("seller/dashboard", {
      user: req.session.userId,
      totalProducts,
      totalOrders,
      recentProducts,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading dashboard");
  }
};
//     //fetch logged in seller
//     const seller = await User.findById(req.session.userId);
//     if (!seller) {
//       return res.redirect("/login");
//     }
//     //fetch sellers products
//     const products = await Product.find({ seller: seller._id }).sort({
//       createdAt: -1,
//     });

//     res.render("seller/dashboard", { user: seller, products });
//   } catch (err) {
//     console.error("❌ Dashboard error:", err);
//     res.render("seller/dashboard", {
//       user: null,
//       error: "error loading dashboard",
//     });
//   }
// };

exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller || seller.role !== "seller") {
      return res.status(404).send("Seller not found");
    }

    const products = await Product.find({ seller: seller._id });

    res.render("sellerProfile", { seller, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
