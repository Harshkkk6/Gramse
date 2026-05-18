const pool = require("../db");

const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, email, hashedPassword]
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

module.exports = {
  registerUser,
};

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // CHECK USER EXISTS
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // COMPARE PASSWORD
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
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
  loginUser,
};