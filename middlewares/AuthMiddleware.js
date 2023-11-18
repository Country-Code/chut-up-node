const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const getUserDataFromJWT = (authorization) => {
  let data = { error: {}, token: null }
  let token;

  if (!authorization?.startsWith('Bearer ')) {
    data.error.status = 400;
    data.error.message = "Invalid Bearer authorization.";
  } else {
    token = authorization.split(' ')[1];
    if (token === undefined) {
      data.error.status = 401;
      data.error.message = "Access denied. No token provided.";
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          data.error.status = 403;
          data.error.message = err.message;
        } else {
          data.token = {id: decodedToken.id, roles: decodedToken.roles};
          data.error = null
        }
      });
    }
  }
  return data;
}

const isAuthenticated = (req, res, next) => {
  const { token, error } = getUserDataFromJWT(req.headers["authorization"] || req.headers["Authorization"]);
  if (error) {
    return res.status(error.status).json({ message: error.message, status: "KO" });
  }
  req.token = token;
  next();
};

const isAdmin = asyncHandler(async (req, res, next) => {
  const { token, error } = getUserDataFromJWT(req.headers["authorization"]);
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
