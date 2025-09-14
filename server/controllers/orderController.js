const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

// STEP 1: Show checkout confirmation
exports.checkout = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ buyer: buyerId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    // Check if user has address
    const user = await User.findById(buyerId);
    if (!user.address || !user.address.address) {
      return res.redirect("/user/address");
    }

    // Show checkout confirmation page
    res.render("checkout", {
      cart,
      address: user.address,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).send("Server error");
  }
};

// STEP 2: Place order
exports.placeOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ buyer: buyerId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    const user = await User.findById(buyerId);
    if (!user.address || !user.address.address) {
      return res.redirect("/user/address");
    }

    // Group items by seller
    const sellerMap = {};
    cart.items.forEach((item) => {
      const sellerId = item.product.seller.toString();
      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          seller: sellerId,
          products: [],
          totalAmount: 0,
        };
      }

      sellerMap[sellerId].products.push({
        product: item.product._id,
        quantity: item.qty,
      });

      sellerMap[sellerId].totalAmount += item.price;
    });

    // Create order
    const order = new Order({
      buyer: buyerId,
      sellers: Object.values(sellerMap),
      shippingAddress: user.address,
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalQty = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.redirect(`/orders/success/${order._id}`);
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).send("Server error");
  }
};

// Order history
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ buyer: userId })
      .populate("sellers.seller")
      .populate("sellers.products.product")
      .sort({ createdAt: -1 });

    res.render("orderHistory", { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
};

// Order success
exports.getOrderSuccess = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("sellers.seller")
      .populate("sellers.products.product");

    if (!order) return res.status(404).send("Order not found");

    res.render("orderSuccess", { order });
  } catch (err) {
    console.error("Order success error:", err);
    res.status(500).send("server error");
  }
};

// //to get user order history
// exports.getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const orders = await Order.find({ buyer: userId })
//       .populate("sellers.seller")
//       .populate("sellers.products.product")
//       .sort({ createdAt: -1 }); //latest first

//     res.render("orderHistory", { orders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching orders");
//   }
// };
