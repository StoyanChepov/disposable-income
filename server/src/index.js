const express = require("express");
const { configDatabase } = require("./config/configDatabase");
const { configExpress } = require("./config/configExpress");
const { configRoutes } = require("./config/configRoutes");
const { configHbs } = require("./config/configHbs");
require("dotenv").config();

createDatabase();

async function createDatabase() {
  const app = express();
  await configDatabase();
  configExpress(app);
  configRoutes(app);

  console.log("Database connected!");
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000");
  });
}
