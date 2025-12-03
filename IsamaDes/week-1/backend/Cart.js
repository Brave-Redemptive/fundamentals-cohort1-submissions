const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: { type: String, required: "true" },
        productName: { type: String, rrequired: "true" },
        productQuantity: { type: Number, default: 1 },
        manufactureDate: { type: Date, required: "true" },
        expiryDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);
