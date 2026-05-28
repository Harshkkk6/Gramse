const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {

  createPayment,

  verifyPayment

} = require("../controllers/paymentController");


// CREATE PAYMENT
router.post(

  "/create",

  authMiddleware,

  allowRoles("buyer"),

  createPayment

);


// VERIFY PAYMENT
router.post(

  "/verify",

  authMiddleware,

  allowRoles("buyer"),

  verifyPayment

);


module.exports = router;