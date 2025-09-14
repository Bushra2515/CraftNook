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

// controllers/orderController.js
//to get sellers orders
// exports.getSellerOrders = async (req, res) => {
//   try {
//     // Find all orders where the logged-in user is a seller
//     const orders = await Order.find({ "sellers.seller": req.user._id })
//       .populate("buyer", "name email") // only fetch buyer's name & email
//       .populate("sellers.products.product", "name price image") // fetch product details
//       .sort({ createdAt: -1 });

//     res.render("seller/orders", { orders, sellerId: req.user._id });
//   } catch (err) {
//     console.error("Error fetching seller orders:", err);
//     res.status(500).send("Server error");
//   }
// };

// Seller Orders with Filters & Sorting
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Filters
    const status = req.query.status || null; // ?status=pending
    let filter = { "sellers.seller": sellerId };
    if (status) {
      filter.status = status;
    }

    // Sorting
    const sortBy = req.query.sort === "oldest" ? 1 : -1; // ?sort=oldest or newest

    const orders = await Order.find(filter)
      .populate("buyer", "name email")
      .populate("sellers.products.product", "name price image")
      .sort({ createdAt: sortBy });

    res.render("seller/orders", {
      orders,
      sellerId,
      currentStatus: status,
      currentSort: req.query.sort || "newest",
    });
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).send("Server error");
  }
};

// Seller Updates Order Status
exports.updateSellerOrder = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orderId = req.params.id;
    const newStatus = req.query.status; // e.g., confirmed, shipped, delivered, cancelled

    // Validate status
    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).send("Invalid status");
    }

    // Find the order where seller is involved
    const order = await Order.findOne({
      _id: orderId,
      "sellers.seller": sellerId,
    });
    if (!order) {
      return res.status(404).send("Order not found");
    }

    //update only this sellers status
    const sellerOrder = order.sellers.find(
      (s) => s.seller.toString() === sellerId.toString()
    );
    if (!sellerOrder) return res.status(404).send("seller order not found");
    sellerOrder.status = newStatus;
    await order.save();

    res.redirect("/seller/orders");
  } catch (err) {
    console.error("Error updating seller order:", err);
    res.status(500).send("Server error");
  }
};
