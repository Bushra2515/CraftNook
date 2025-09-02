const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} = require("../controllers/cartController");

//add to cart
router.post("/cart/add", addToCart);

//view cart
router.get("/cart", getCart);

//remove from cart
router.post("/cart/remove", removeFromCart);

//update quatity
router.post("/cart/update", updateQuantity);

module.exports = router;
