require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Auth Routes
app.use("/api/auth", authRoutes);

app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Protected route accessed",
      user: req.user,
    });

  }
);

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});