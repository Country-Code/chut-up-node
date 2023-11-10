const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const getUserId = (authorization) => {
  let user = { error: {}, id: null }
  let token= "";

  if (authorization?.startsWith('Bearer ')) {
    token = authorization.split(' ')[1];
  } else {
    user.error.status = 400;
    user.error.message = "Invalid Bearer authorization.";
    return user;
  }

  if (token === undefined) {
    user.error.status = 401;
    user.error.message = "Access denied. No token provided.";
    return user;
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        user.error.status = 403;
        user.error.message = "Invalid token.";
      } else {
        user.token = data;
        user.error = null
      }
    });
    return user;
  }

}

const isAuthenticated = (req, res, next) => {
  const { token, error } = getUserId(req.headers["authorization"]);
  if (error) {
    return res.status(error.status).json({ message: error.message, status: "KO" });
  }
  req.token = token;
  next();
};

const isAdmin = asyncHandler(async (req, res, next) => {
  const { token, error } = getUserId(req.headers["authorization"]);
  if (error) {
    return res.status(error.status).json({ message: error.message, status: "KO" });
  }

  const user = await User.findById(token.id);

  if (user?.isAdmin) {
    req.token = token;
    next();
  } else {
    return res.status(403).json({ message: 'Requires admin access' });
  }
})

module.exports = { isAuthenticated, isAdmin };
