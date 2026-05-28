const express = require("express");

const router = express.Router();

const {
  createFarmer,
  getMyFarmers
} = require("../controllers/farmerController");

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

router.post(

  "/create",

  authMiddleware,

  allowRoles("partner"),

  createFarmer
);
router.get(
  "/my-farmers",
  authMiddleware,
  allowRoles("partner"),
  getMyFarmers
);

module.exports = router;