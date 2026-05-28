const partnerDashboard = async (req, res) => {

  res.json({
    message: "Welcome Partner Dashboard",
    user: req.user,
  });
};

module.exports = {
  partnerDashboard,
};