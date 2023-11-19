const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {logger} = require('../utils/tools');

const getUserDataFromJWT = (authorization) => {
  let data = { error: {}, user: null }
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
          logger.log().log(decodedToken, "getUserDataFromJWT decodedToken");
          data.user = {id: decodedToken._id, roles: decodedToken.roles};
          data.error = null
        }
      });
    }
  }
          logger.log().log(data, "getUserDataFromJWT data");
  return data;
}

const isAuthenticated = (req, res, next) => {
  const { user, error } = getUserDataFromJWT(req.headers["authorization"] || req.headers["Authorization"]);
  if (error) {
    res.status(error.status)
    throw new Error(error.message);
  }
  req.user = user;
  next();
};

const verifyOneRole = (...allowedRoles) => {
  return (req, res, next) => {
    const { user, error } = getUserDataFromJWT(req.headers["authorization"] || req.headers["Authorization"]);
    if (error) {
      res.status(error.status)
      throw new Error(error.message);
    }
    const allowedRolesArray = [...allowedRoles];
    const isAllowed = user.roles.map(role => allowedRolesArray.includes(role)).find(val => val === true);
    if (!isAllowed) {
      res.status(401)
      throw new Error('Required roles missed!');
    }
    next();
  }
}

const verifyAllRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { user, error } = getUserDataFromJWT(req.headers["authorization"] || req.headers["Authorization"]);
    if (error) {
      res.status(error.status)
      throw new Error(error.message);
    }
    const allowedRolesArray = [...allowedRoles];
    const isDenied = allowedRolesArray.map(role => !user.roles.includes(role)).find(val => val === true);
    logger.log().log(`verifyAllRoles allowedRolesArray : ${allowedRolesArray}`);
    console.log("verifyAllRoles user.roles : ", user.roles);
    console.log("verifyAllRoles result : ", isDenied);
    if (isDenied) {
      res.status(401)
      throw new Error('At least one of the required roles missed!');
    }
    next();
  }
}

module.exports = { isAuthenticated, verifyOneRole, verifyAllRoles };
