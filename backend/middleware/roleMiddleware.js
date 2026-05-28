const allowRoles = (...allowedRoles) => {

  return (req, res, next) => {

    const userRole = req.user.role;

    // CHECK ROLE
    if (!allowedRoles.includes(userRole)) {

      return res.status(403).json({
        error: "Access denied",
      });
    }

    next();
  };
};

module.exports = allowRoles;