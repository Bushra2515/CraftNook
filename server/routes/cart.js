// const express = require("express");
// const router = express.Router();
// const {
//   addToCart,
//   getCart,
//   removeFromCart,
//   updateQuantity,
// } = require("../controllers/cartController");
// const { isAuthenticated, isBuyer } = require("../middleware/auth");

// //add to cart
// router.post("/cart/add", addToCart, isAuthenticated, isBuyer);

// //view cart
// router.get("/cart", getCart, isAuthenticated, isBuyer);

// //remove from cart
// router.post("/cart/remove", removeFromCart, isAuthenticated, isBuyer);

// //update quatity
// router.post("/cart/update", updateQuantity, isAuthenticated, isBuyer);

// module.exports = router;
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated, isBuyer } = require("../middleware/auth");

//view cart
router.get("/", isAuthenticated, isBuyer, cartController.viewCart);

router.get("/add/:id", isAuthenticated, isBuyer, cartController.addToCart);
//add to cart
router.post("/add/:id", isAuthenticated, isBuyer, cartController.addToCart);

router.get("/remove/:id", isAuthenticated, isBuyer, cartController.removeItem);
router.post("/remove/:id", isAuthenticated, isBuyer, cartController.removeItem);

router.get("/reduce/:id", isAuthenticated, isBuyer, cartController.reduceQty);
router.post("/reduce/:id", isAuthenticated, isBuyer, cartController.reduceQty);

module.exports = router;
