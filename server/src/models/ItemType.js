//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a itemtype schema

const itemtypeSchema = new Schema({
  name: { type: String, required: true },
});
const ItemType = model("ItemType", itemtypeSchema);

module.exports = { ItemType };
