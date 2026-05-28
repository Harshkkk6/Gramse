const pool = require("../db");

const verifyAadhaar = async (req, res) => {
  try {

    const { aadhaarNumber } = req.body;

    // FIND USER
    const result = await pool.query(
      `
      SELECT * FROM aadhaar_users
      WHERE aadhaar_number = $1
      `,
      [aadhaarNumber]
    );

    const user = result.rows[0];

    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        error: "Aadhaar data not found",
      });
    }

     // SUCCESS RESPONSE
    res.json({
      message: "Aadhaar verified successfully",
      data: {
        fullName: user.full_name,
        address: user.address,
        dob: user.dob,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  verifyAadhaar,
};