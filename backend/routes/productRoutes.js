const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  searchProducts,
  getOrganicProducts
} = require("../controllers/productController");

// CREATE PRODUCT
router.post(

  "/create",

  authMiddleware,

  allowRoles("partner"),

  createProduct
);

router.get(
  "/all",
  authMiddleware,
  getProducts
);

router.get(
  "/search",
  authMiddleware,
  searchProducts
);

router.get(
  "/filter/organic",
  authMiddleware,
  getOrganicProducts
);


module.exports = router;