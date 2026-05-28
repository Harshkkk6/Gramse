const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  partnerDashboard,
} = require("../controllers/partnerController");

// ONLY PARTNERS
router.get(
  "/dashboard",

  authMiddleware,

  allowRoles("partner"),

  partnerDashboard
);

module.exports = router;