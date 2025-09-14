const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    address: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Only for sellers
    sellerProfile: {
      businessName: { type: String, trim: true },
      businessType: { type: String, trim: true },
      description: { type: String, trim: true },
      contact: { type: String, trim: true },
      location: {
        type: {
          type: String,
          enum: ["Local", "State", "Country", "Worldwide"],
          default: "Worldwide",
        },
        name: { type: String, trim: true }, // e.g., Mumbai, Maharashtra, India
      },
    },

    // Only for buyers (we’ll add this later)
    buyerProfile: {
      location: {
        type: {
          type: String,
          enum: ["Local", "State", "Country", "Worldwide"],
          default: "Worldwide",
        },
        name: { type: String, trim: true },
      },
    },
  },
  { timestamps: true }
);
//need to add admin schema
module.exports = mongoose.model("User", userSchema);
