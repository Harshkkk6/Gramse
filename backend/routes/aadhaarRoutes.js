const express = require("express");

const router = express.Router();

const {
  verifyAadhaar,
} = require("../controllers/aadhaarController");

router.post(
  "/verify-aadhaar",
  verifyAadhaar
);

module.exports = router;