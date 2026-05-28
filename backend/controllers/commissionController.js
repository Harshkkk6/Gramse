const pool = require("../db");


// GET PARTNER COMMISSIONS
const getPartnerCommissions = async (req, res) => {

  try {

    const partner_id = req.user.id;

    const result = await pool.query(

      `
      SELECT *
      FROM commissions

      WHERE partner_id = $1

      ORDER BY id DESC
      `,

      [partner_id]
    );

    res.status(200).json({

      commissions: result.rows

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


module.exports = {

  getPartnerCommissions

};