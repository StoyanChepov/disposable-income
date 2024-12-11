const mongoose = require("mongoose");

async function configDatabase() {
  //Set database connection
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Database connected!");
}

module.exports = { configDatabase };
