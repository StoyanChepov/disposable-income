//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a category schema

const categorySchema = new Schema({
  name: { type: String, required: true },
  createdOn: { type: Date, required: true },
  userId: { type: Types.ObjectId, ref: "User" },
});

const Category = model("Category", categorySchema);

module.exports = { Category };
