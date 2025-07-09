var mongoose = require("mongoose");
var Schema = mongoose.Schema;


//New sub-schema for inventory items
const InventoryItemSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Number, required: true },
  servicesUsedIn: { type: String }, 
  estUses: { type: Number, required: true },
});

var businessServiceSchema = new Schema(
  {
    businessTypeId: [{ type: Schema.Types.ObjectId, ref: "Business" }],
    service: { type: String },
    price: { type: Number, default: 0 },
    serviceTime: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: false },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
    role: { type: Number },
    //inventory items used in this service
    inventoryItems: [InventoryItemSchema]
  },
  {
    collection: "businessService",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

var businessSchema = mongoose.model("businessService", businessServiceSchema);

module.exports = businessSchema;
