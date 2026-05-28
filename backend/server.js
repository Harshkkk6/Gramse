require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());


// ROUTES
const authRoutes = require("./routes/authRoutes");

const aadhaarRoutes = require("./routes/aadhaarRoutes");

const partnerRoutes = require("./routes/partnerRoutes");

const farmerRoutes = require("./routes/farmerRoutes");

const farmRoutes = require("./routes/farmRoutes");

const productRoutes = require("./routes/productRoutes");

const orderRoutes = require("./routes/orderRoutes");

const deliveryRoutes = require("./routes/deliveryRoutes");

const commissionRoutes = require("./routes/commissionRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const analyticsRoutes = require("./routes/analyticsRoutes");

// HOME
app.get("/", (req, res) => {

  res.send("Backend running");

});


// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api", aadhaarRoutes);

app.use("/api/partner", partnerRoutes);

app.use("/api/farmer", farmerRoutes);

app.use("/api/farm", farmRoutes);

app.use("/api/product", productRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/delivery", deliveryRoutes);

app.use("/api/commission", commissionRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/analytics", analyticsRoutes);

// START SERVER
app.listen(5000, () => {

  console.log("Server running on port 5000");

});