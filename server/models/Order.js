// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     buyer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     sellers: [
//       {
//         seller: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         products: [
//           {
//             product: {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: "Product",
//             },
//             quantity: { type: Number, default: 1 },
//           },
//         ],
//         totalAmount: { type: Number, require: true },
//       },
//     ],
//     shippingAddress: {
//       name: String,
//       phone: String,
//       address: String,
//       city: String,
//       state: String,
//       pincode: String,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellers: [
      {
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        products: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: { type: Number, default: 1 },
          },
        ],
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
