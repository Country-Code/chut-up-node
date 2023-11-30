const asyncHandler = require("express-async-handler");
const jwt = require("../utils/jwt");
const { errorUtil } = require("../utils/tools")
const { authErrors } = require("../config/errorCodes")

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = jwt.getTokenFromReq(req);
  let errorMessage = "Access denied. No token provided.";
  if (token) {
    console.log("verifyJWT token true: ", token);
    await jwt
      .verifyToken(token)
      .then((data)=> {
        console.log("verifyJWT token verified : ", data);
        req.payload = data.payload;
        req.newToken = data.newToken;
        errorMessage = null;
        next();
      })
      .catch((err) => {
        console.log("verifyJWT token NOT verified. err : ", err);
        errorMessage = err.message;
      });
  }
  if (errorMessage) {
    console.log("verifyJWT errorMessage: ", errorMessage);
    errorConfig = authErrors.midlleware.token.missed;
    throw errorUtil.generateError({...errorConfig, message: errorMessage})
  }
});

const verifyOneRole = (...allowedRoles) => {
  return asyncHandler((req, res, next) => {
    const userRoles = req.payload.roles;
    const allowedRoles = [...allowedRoles];
    const isAllowed = userRoles.map(role => allowedRoles.includes(role)).find(val => val === true);
    if (!isAllowed) {
      throw errorUtil.generateError(authErrors.midlleware.roles.oneRole);
    }
    next();
  });
};

const verifyAllRoles = (...allowedRoles) => {
  return asyncHandler((req, res, next) => {
    const userRoles = req.payload.roles;
    const isDenied = allowedRoles.map(role => !userRoles.includes(role)).find(val => val === true);
    if (isDenied) {
      throw errorUtil.generateError(authErrors.midlleware.roles.allRoles);
    }
    next();
  });
};

module.exports = { verifyJWT, verifyOneRole, verifyAllRoles };
