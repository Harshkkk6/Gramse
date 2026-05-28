const pool = require("../db");


// CREATE FARM
const createFarm = async (req, res) => {
  try {
    
    const partner_id = req.user.id;
    const {
      farmer_id,
      farm_name,
      location,
      soil_type,
      water_source,
      total_area,
      crop_type,
      organic_certified
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO farms
      (
        partner_id,
        farmer_id,
        farm_name,
        location,
        soil_type,
        water_source,
        total_area,
        crop_type,
        organic_certified
      )

      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

      RETURNING *
      `,
      [
        partner_id,
        farmer_id,
        farm_name,
        location,
        soil_type,
        water_source,
        total_area,
        crop_type,
        organic_certified
      ]
    );

    res.status(201).json({
      message: "Farm created successfully",
      farm: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }
};




// GET ALL FARMS
const getFarms = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM farms ORDER BY id DESC"
    );

    res.status(200).json({
      farms: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }
};

// UPDATE FARM
const updateFarm = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      farm_name,
      location,
      soil_type,
      water_source,
      total_area,
      crop_type,
      organic_certified
    } = req.body;

    const result = await pool.query(
      `
      UPDATE farms

      SET
      farm_name = $1,
      location = $2,
      soil_type = $3,
      water_source = $4,
      total_area = $5,
      crop_type = $6,
      organic_certified = $7

      WHERE id = $8
      AND partner_id = $9

      RETURNING *
      `,
      [
        partner_id, 
        farm_name,
        location,
        soil_type,
        water_source,
        total_area,
        crop_type,
        organic_certified,
        id,
        req.user.id
      ]
    );

    res.status(200).json({
      message: "Farm updated successfully",
      farm: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }
};

// DELETE FARM
const deleteFarm = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM farms
      WHERE id = $1
AND partner_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    // CHECK IF FARM EXISTS
    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "Farm not found"
      });

    }

    res.status(200).json({
      message: "Farm deleted successfully",
      deletedFarm: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

module.exports = {
  createFarm,
  getFarms,
  updateFarm,
  deleteFarm
};

