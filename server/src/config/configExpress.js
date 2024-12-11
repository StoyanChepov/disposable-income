const express = require("express");
const cookieParser = require("cookie-parser");
const secret = "supersecret";
const cors = require("cors");

function configExpress(app) {
  const corsOptions = {
    origin: "http://localhost:4200", // Replace with your frontend's URL
    credentials: true, // Allow credentials (cookies, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  };
  app.use(cookieParser(secret));
  app.use("/static", express.static("static"));
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
}

module.exports = { configExpress };
