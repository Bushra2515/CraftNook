const { error } = require("console");
const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { type } = require("os");
const { buffer } = require("stream/consumers");

const storage = multer.memoryStorage();

//multer upload middleware
const upload = multer({
  storage,
  // limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, or GIF images are allowed"));
    }
  },
}); //2MB max
// module.exports = upload;
exports.uploadMiddleware = upload.single("image");

// Render Add Product form

exports.renderAddProduct = (req, res) => {
  if (!req.session.userId || req.session.userRole !== "seller") {
    return res.redirect("login");
  }
  res.render("seller/addproduct", { error: null });
};

// Handle Add Product
exports.addProduct = async (req, res) => {
  try {
    if (!req.session.userId || req.session.userRole !== "seller") {
      return res.redirect("login");
    }

    const { name, price, description, category, locationType, locationName } =
      req.body;

    if (!req.file) {
      return res.render("seller/addproduct", {
        error: "Image is required.",
      });
    }

    //ensure uploads folder exist
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    //generate unique file name
    const filename = Date.now() + ".jpg";
    const finalPath = path.join(uploadPath, filename);

    //compress and resize with sharp
    await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 70 })
      .toFile(finalPath);

    const imagePath = `/uploads/${filename}`;

    const seller = await User.findById(req.session.userId);

    if (!seller) {
      return res.render("seller/addproduct", { error: "Seller not found. " });
    }

    await Product.create({
      name,
      price,
      description,
      category,
      image: imagePath,
      seller: req.session.userId, // link product to logged-in seller
      businessName: seller.sellerProfile.businessName,
      location: seller.location, //takes location directly from the seller
    });

    // After adding → go back to dashboard
    res.redirect("/seller/dashboard");
  } catch (err) {
    console.error("Add product error:", err.message);

    let errorMsg = err.message.includes("Only PNG, JPG or GIF")
      ? "Invalid file type. Please upload JPG, PNG or GIf only."
      : "Error uploading image. Please try again.";

    res.render("seller/addproduct", { error: errorMsg });
  }
};

//render edit seller product form
exports.renderEditProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.session.userId,
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("seller/editproduct", { product, error: null });
  } catch (err) {
    console.error("Render edit error:", err.message);
    res.status(500).send("Error loading product");
  }
};

// Handle update
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.session.userId,
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const { name, price, description, category } = req.body;

    // If a new image is uploaded → process with Sharp
    if (req.file) {
      const uploadPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

      const filename = Date.now() + ".jpg";
      const finalPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(finalPath);

      // delete old image
      if (
        product.image &&
        fs.existsSync(path.join(__dirname, `..${product.image}`))
      ) {
        fs.unlinkSync(path.join(__dirname, `..${product.image}`));
      }

      product.image = `/uploads/${filename}`;
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;

    await product.save();

    res.redirect("/seller/dashboard");
  } catch (err) {
    console.error("Update product error:", err.message);
    res.render("seller/editproduct", {
      product: req.body,
      error: "Error updating product.",
    });
  }
};

//delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.session.userId,
    });

    if (product && product.image) {
      const imgPath = path.join(__dirname, `..${product.image}`);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    res.redirect("/seller/dashboard");
  } catch (err) {
    console.error("Delete product error:", err.message);
    res.status(500).send("Error deleting product");
  }
};

//show products from the seller to the user
exports.showProducts = async (req, res) => {
  try {
    const { locationType, locationName } = req.query;
    let filter = {};

    if (locationType) {
      filter["location.type"] = locationType;
    }
    if (locationName && locationType !== "worldwide") {
      filter["location.name"] = { $regex: locationName, $options: "i" }; // case-insensitive search
    }

    const products = await Product.find(filter).populate(
      "seller",
      "businessName"
    );
    // console.log("req.user ===", req.user);
    //  user: req.user
    res.render("products", { products });

    // res.render("products", { products });
  } catch (err) {
    console.error("Show Products error:", err);
    res.status(500).send("Error fetching products");
  }
};

//get product details page
//get single product by id
// app.get("/product/:id", async (req, res) => {
//   try {
//     const productdata = await Product.findById(req.params.id).lean(); // Code that might throw an error
//     if (!product) return; // params Accessing the 'id' route parameter
//     res.status(404).send("product not found");
//     res.render("productDetail", { product });
//   } catch (err) {
//     console.error(err); // Code to execute if an error occurs in the try block
//     res.status(500).send("server error");
//   }
// });
// console.log("product seller", Product.seller);
exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    if (!product) {
      return res.status(404).send("product not found");
    }
    res.render("ProductDetail", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
