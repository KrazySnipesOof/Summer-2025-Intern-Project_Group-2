const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Shopping list model schema
const ShoppingListSchema = new Schema({
  itemName: { type: String, required: true }, 
  itemId: { type: Schema.Types.ObjectId, ref: "Inventory" },
  quantity: { type: Number, default: 1 }, // Auto-generated quantity
  userQuantity: { type: Number }, // Optional user-specified quantity
  isPurchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
