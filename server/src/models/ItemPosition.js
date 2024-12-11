//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a user schema

const itempositionSchema = new Schema({
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  item: { type: Types.ObjectId, ref: "Item", required: false },
  position: { type: Types.ObjectId, ref: "Position", required: true },
  createdOn: { type: Date, required: true },
  unit: { type: Types.ObjectId, ref: "Unit", required: false },
});

const ItemPosition = model("ItemPosition", itempositionSchema);

module.exports = { ItemPosition };
