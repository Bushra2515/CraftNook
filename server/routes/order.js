const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isAuthenticated, isBuyer } = require("../middleware/auth");

//checkout route
// router.post("/checkout", isAuthenticated, isBuyer, orderController.checkout);
router.get("/checkout", isAuthenticated, isBuyer, orderController.checkout);

//place order
router.post(
  "/place-order",
  isAuthenticated,
  isBuyer,
  orderController.placeOrder
);

//get user order history
router.get(
  "/orderHistory",
  isAuthenticated,
  isBuyer,
  orderController.getUserOrders
);

//order success page
router.get(
  "/success/:id",
  isAuthenticated,
  isBuyer,
  orderController.getOrderSuccess
);

module.exports = router;
