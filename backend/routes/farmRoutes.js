const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  createFarm,
  getFarms,
  updateFarm,
  deleteFarm
} = require("../controllers/farmController");



// CREATE FARM
router.put(
  "/update/:id",
  authMiddleware,
  allowRoles("partner"),
  updateFarm
);

router.delete(
  "/delete/:id",
  authMiddleware,
  allowRoles("partner"),
  deleteFarm
);

router.post(
  "/create",
  authMiddleware,
  allowRoles("partner"),
  createFarm
);




// GET ALL FARMS
router.get(
  "/all",
  authMiddleware,
  allowRoles("partner"),
  getFarms
);



module.exports = router;