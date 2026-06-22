const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECURE);

    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Not Authorized as Admin",
  });
};
