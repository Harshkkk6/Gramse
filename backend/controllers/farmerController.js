const pool = require("../db");
const bcrypt = require("bcryptjs");

const createFarmer = async (req, res) => {

  try {

    const {

      full_name,
      mobile_number,
      aadhaar_number,
      pan_number,
      bank_account,
      ifsc_code,
      address

    } = req.body;

    // VERIFY AADHAAR

    const aadhaarCheck = await pool.query(

      `SELECT * FROM mock_aadhaar_data
       WHERE aadhaar_number = $1`,

      [aadhaar_number]
    );

    if (aadhaarCheck.rows.length === 0) {

      return res.status(400).json({
        error: "Invalid Aadhaar"
      });
    }

    // VERIFY PAN

    const panCheck = await pool.query(

      `SELECT * FROM mock_pan_data
       WHERE pan_number = $1`,

      [pan_number]
    );

    if (panCheck.rows.length === 0) {

      return res.status(400).json({
        error: "Invalid PAN"
      });
    }

    // VERIFY BANK

    const bankCheck = await pool.query(

      `SELECT * FROM mock_bank_data
       WHERE account_number = $1
       AND ifsc_code = $2`,

      [bank_account, ifsc_code]
    );

    if (bankCheck.rows.length === 0) {

      return res.status(400).json({
        error: "Invalid Bank Details"
      });
    }

    // TEMP PASSWORD

    const tempPassword = "Farmer@123";

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(
      tempPassword,
      10
    );

    // CREATE LOGIN ACCOUNT

    const userResult = await pool.query(

      `INSERT INTO users
      (name, email, password, role)

      VALUES ($1, $2, $3, $4)

      RETURNING *`,

      [
        full_name,
        `${mobile_number}@farmer.com`,
        hashedPassword,
        "farmer"
      ]
    );

    const user = userResult.rows[0];

    // CREATE FARMER PROFILE

    const farmerResult = await pool.query(

      `INSERT INTO farmers
      (
        partner_id,
        full_name,
        mobile_number,
        aadhaar_number,
        pan_number,
        bank_account,
        ifsc_code,
        address
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)

      RETURNING *`,

      [
        req.user.id,
        full_name,
        mobile_number,
        aadhaar_number,
        pan_number,
        bank_account,
        ifsc_code,
        address
      ]
    );

    res.status(201).json({

      message: "Farmer created successfully",

      temporary_password: tempPassword,

      farmer: farmerResult.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });
  }
};

const getMyFarmers = async (req, res) => {

  try {

    console.log("REQ USER:", req.user);

    const partnerId = req.user.id;

    console.log("PARTNER ID:", partnerId);

    const result = await pool.query(
      `
      SELECT *
      FROM farmers
      WHERE partner_id = $1
      `,
      [partnerId]
    );

    res.json({
      farmers: result.rows
    });

  } catch (error) {

    console.log("ERROR:", error);

    res.status(500).json({
      error: "Server error"
    });

  }

};

module.exports = {
  createFarmer,
  getMyFarmers
};

