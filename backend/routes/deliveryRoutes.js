const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {

  createDeliveryAgent,

  assignDeliveryAgent

} = require("../controllers/deliveryController");


// CREATE DELIVERY AGENT
router.post(

  "/create",

  authMiddleware,

  allowRoles("partner"),

  createDeliveryAgent

);


// ASSIGN DELIVERY AGENT
router.put(

  "/assign/:id",

  authMiddleware,

  allowRoles("partner"),

  assignDeliveryAgent

);


module.exports = router;