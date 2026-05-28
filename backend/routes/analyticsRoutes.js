const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {

  getAdminAnalytics,

  getPartnerAnalytics,

  getFarmerAnalytics,

  getBuyerAnalytics

} = require("../controllers/analyticsController");


// ADMIN ANALYTICS
router.get(

  "/admin",

  authMiddleware,

  allowRoles("admin"),

  getAdminAnalytics

);

// PARTNER ANALYTICS
router.get(

  "/partner",

  authMiddleware,

  allowRoles("partner"),

  getPartnerAnalytics

);

// FARMER ANALYTICS
router.get(

  "/farmer",

  authMiddleware,

  allowRoles("farmer"),

  getFarmerAnalytics

);
    
// BUYER ANALYTICS
router.get(

  "/buyer",

  authMiddleware,

  allowRoles("buyer"),

  getBuyerAnalytics

);

module.exports = router;