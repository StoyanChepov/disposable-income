//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a item schema

const itemSchema = new Schema({
  name: { type: String, required: true },
  createdOn: { type: Date, required: true },
  userId: { type: Types.ObjectId, ref: "User" },
  itemTypeId: { type: Types.ObjectId, ref: "ItemType" },
});

const Item = model("Item", itemSchema);

module.exports = { Item };
