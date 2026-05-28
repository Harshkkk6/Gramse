const pool = require("../db");


// CREATE PRODUCT
const createProduct = async (req, res) => {

  try {

    const partner_id = req.user.id;

    const {
      farm_id,
      farmer_id,
      product_name,
      category,
      quantity,
      unit,
      price_per_unit,
      quality_grade,
      harvest_date,
      organic
    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO products
      (
        farm_id,
        farmer_id,
        partner_id,
        product_name,
        category,
        quantity,
        unit,
        price_per_unit,
        quality_grade,
        harvest_date,
        organic
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)

      RETURNING *
      `,

      [
        farm_id,
        farmer_id,
        partner_id,
        product_name,
        category,
        quantity,
        unit,
        price_per_unit,
        quality_grade,
        harvest_date,
        organic
      ]
    );

    res.status(201).json({

      message: "Product created successfully",

      product: result.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {

  try {

    const result = await pool.query(

      `
      SELECT
        products.*,
        farms.farm_name,
        farms.location

      FROM products

      JOIN farms
      ON products.farm_id = farms.id

      ORDER BY products.id DESC
      `
    );

    res.status(200).json({
      products: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

// SEARCH PRODUCTS
const searchProducts = async (req, res) => {

  try {

    const { name } = req.query;

    const result = await pool.query(

      `
      SELECT
        products.*,
        farms.farm_name,
        farms.location

      FROM products

      JOIN farms
      ON products.farm_id = farms.id

      WHERE LOWER(products.product_name)
      LIKE LOWER($1)

      ORDER BY products.id DESC
      `,

      [`%${name}%`]

    );

    res.status(200).json({
      products: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

// GET ORGANIC PRODUCTS
const getOrganicProducts = async (req, res) => {

  try {

    const result = await pool.query(

      `
      SELECT
        products.*,
        farms.farm_name,
        farms.location

      FROM products

      JOIN farms
      ON products.farm_id = farms.id

      WHERE products.organic = true

      ORDER BY products.id DESC
      `
    );

    res.status(200).json({
      products: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

module.exports = {
  createProduct,
  getProducts,
  searchProducts,
  getOrganicProducts
};