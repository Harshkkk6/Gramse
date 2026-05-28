const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {

  getPartnerCommissions

} = require("../controllers/commissionController");


// GET PARTNER COMMISSIONS
router.get(

  "/my-commissions",

  authMiddleware,

  allowRoles("partner"),

  getPartnerCommissions

);


module.exports = router;