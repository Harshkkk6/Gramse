const pool = require("../db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


// REGISTER USER
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;
    
    // CHECK IF ADMIN ALREADY EXISTS
if (role === "admin") {

  const adminExists = await pool.query(

    `
    SELECT *
    FROM users
    WHERE role = 'admin'
    `
  );

  if (adminExists.rows.length > 0) {

    return res.status(400).json({
      error: "Admin already exists"
    });

  }

}

    // CHECK EXISTING USER
    const existingUser = await pool.query(

      `
      SELECT *
      FROM users
      WHERE email = $1
      `,

      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        error: "Email already exists"
      });

    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER
    const result = await pool.query(

      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )

      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,

      [
        name,
        email,
        hashedPassword,
        role
      ]
    );

    res.status(201).json({

      message: "User registered successfully",

      user: result.rows[0],

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};


// LOGIN USER
const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // FIND USER
    const result = await pool.query(

      `
      SELECT *
      FROM users
      WHERE email = $1
      `,

      [email]
    );

    const user = result.rows[0];

    // CHECK USER EXISTS
    if (!user) {

      return res.status(400).json({
        error: "User not found",
      });

    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        error: "Invalid password",
      });

    }

    // CREATE TOKEN
    const token = jwt.sign(

      {
        id: user.id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    res.json({

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
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

  registerUser,

  loginUser

};