const { Schema, SchemaTypes: Types, model } = require("mongoose");

//TODO: Create a user schema

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    collation: { locale: "en", strength: 2 },
  }
);

const User = model("User", userSchema);

module.exports = { User };
