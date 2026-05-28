const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    // GET TOKEN
    const authHeader = req.headers.authorization;

    // CHECK TOKEN EXISTS
    if (!authHeader) {

      return res.status(401).json({
        error: "No token provided"
      });

    }

    // REMOVE Bearer
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    // SAVE USER
    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      error: "Invalid token"
    });

  }

};

module.exports = authMiddleware;