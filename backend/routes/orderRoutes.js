const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {

  placeOrder,

  getMyOrders,

  updateOrderStatus,

  trackOrder

} = require("../controllers/orderController");


// PLACE ORDER
router.post(

  "/place",

  authMiddleware,

  allowRoles("buyer"),

  placeOrder

);


// GET MY ORDERS
router.get(

  "/my-orders",

  authMiddleware,

  allowRoles("buyer"),

  getMyOrders

);


// UPDATE ORDER STATUS
router.put(

  "/update-status/:id",

  authMiddleware,

  allowRoles("partner"),

  updateOrderStatus

);


// TRACK ORDER
router.get(

  "/track/:id",

  authMiddleware,

  trackOrder

);


module.exports = router;