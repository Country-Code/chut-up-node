const jwt = require("jsonwebtoken");
const {logger} = require('../utils/tools');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  token = token == "";
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        let error={};
        error.status = 401;
        error.message = "Invalid token.";
        reject(error)
      } else {
        let data={};
        data.payload = payload;
        data.newToken = generate(payload);
        resolve(data);
      }
    });
  });
}



module.exports = {generate, verify};