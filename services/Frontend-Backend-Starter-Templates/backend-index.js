// backend/index.js
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("EHB backend ready"));
module.exports = app;
