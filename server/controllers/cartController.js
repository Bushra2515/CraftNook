const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Add product (or increase qty by 1)
exports.addToCart = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    let cart = await Cart.findOne({ buyer: buyerId }).populate("items.product");

    if (!cart) {
      cart = new Cart({
        buyer: buyerId,
        items: [],
        totalQty: 0,
        totalPrice: 0,
      });
    }

    const existingItem = cart.items.find(
      (i) => i.product._id.toString() === productId
    );

    if (existingItem) {
      existingItem.qty++;
      existingItem.price = existingItem.qty * existingItem.product.price;
    } else {
      cart.items.push({
        product: productId,
        qty: 1,
        price: product.price,
      });
    }

    cart.totalQty = cart.items.reduce((sum, i) => sum + i.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price, 0);

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).send("Server error");
  }
};

// View cart
exports.viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.render("cart", { products: null, totalQty: 0, totalPrice: 0 });
    }

    res.render("cart", {
      products: cart.items,
      totalQty: cart.totalQty,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("View cart error:", err);
    res.status(500).send("Server error");
  }
};

// Reduce quantity
exports.reduceQty = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ buyer: buyerId }).populate(
      "items.product"
    );
    if (!cart) return res.redirect("/cart");

    const item = cart.items.find((i) => i.product._id.toString() === productId);

    if (item) {
      item.qty--;
      if (item.qty <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product._id.toString() !== productId
        );
      } else {
        item.price = item.qty * item.product.price;
      }
    }

    cart.totalQty = cart.items.reduce((sum, i) => sum + i.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price, 0);

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Reduce qty error:", err);
    res.status(500).send("Server error");
  }
};

// Remove item completely
exports.removeItem = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ buyer: buyerId }).populate(
      "items.product"
    );
    if (!cart) return res.redirect("/cart");

    cart.items = cart.items.filter(
      (i) => i.product._id.toString() !== productId
    );

    cart.totalQty = cart.items.reduce((sum, i) => sum + i.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price, 0);

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).send("Server error");
  }
};
