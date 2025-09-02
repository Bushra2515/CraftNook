// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },

//   description: {
//     type: String,
//     required: true,
//   },

//   image: {
//     type: String,
//     required: false,
//   }, // url or  file path

//   seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: {
      type: String,
      enum: ["bakery", "handmade", "other"],
      default: "other",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: { type: String, required: true }, // later we can link to User
    location: {
      type: String, //auto filled from seller
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
