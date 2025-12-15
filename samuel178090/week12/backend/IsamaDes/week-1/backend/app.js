const express = require("express");
const cors = require("cors");
const cartRoutes = require("./cartRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/cart", cartRoutes);

module.exports = app;
