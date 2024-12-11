//TODO replace with your own data
const { Schema, Types, model } = require("mongoose");

//TODO: Create a user schema

const attachmentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  createdOn: { type: Date, required: true },
  userId: { type: Types.ObjectId, ref: "User" },
  position: { type: Types.ObjectId, ref: "Position" },
});

const Attachment = model("Attachment", attachmentSchema);

module.exports = { Attachment };
