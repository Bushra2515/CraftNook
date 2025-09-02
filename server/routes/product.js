const express = require("express");
const router = express.Router();
const {
  showProducts,
  getProductDetail,
} = require("../controllers/productController");

router.get("/products", showProducts);

router.get("/products/:id", getProductDetail);

module.exports = router;
