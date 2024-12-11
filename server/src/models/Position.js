//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a user schema

const positionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: Types.ObjectId, ref: "Category", required: true },
  type: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "User", required: false },
});

const Position = model("Position", positionSchema);

module.exports = { Position };
