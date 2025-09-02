const Cart = require("../models/Cart");
const Product = require("../models/Product");

// // 🛒 Add to Cart
// exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId, quantity } = req.body;
//     const qty = parseInt(quantity) || 1;

//     // check if product exists
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // check if product already in cart
//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex > -1) {
//       // update quantity
//       cart.items[itemIndex].quantity += qty;
//     } else {
//       // add new product
//       cart.items.push({ product: productId, quantity: qty });
//     }

//     await cart.save();
//     res.json({ message: "Added to cart", cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// 🛒 Get Cart

// controllers/cartController.js

exports.addToCart = async (req, res) => {
  try {
    console.log("📩 Incoming body:", req.body);

    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();

    res.json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("❌ Error in addToCart:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🛒 Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Removed", cart });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🛒 Update Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Product not in cart" });

    item.quantity = qty;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
