const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");

const app = express();
const PORT = 3000;

// ==========================
// 🧩 Middleware
// ==========================
app.use(express.json());

// ==========================
// 📦 MongoDB Connection
// ==========================
mongoose
  .connect("mongodb://127.0.0.1:27017/productDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ==========================
// 🧠 CRUD ROUTES
// ==========================

// 🟢 CREATE a Product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔵 READ All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟣 READ a Product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 UPDATE a Product
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔴 DELETE a Product
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// 🏠 Root Route
// ==========================
app.get("/", (req, res) => {
  res.send("🛒 Welcome to Product Management API");
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
