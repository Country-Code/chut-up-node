const jwt = require("jsonwebtoken");

const generate = ({ _id, roles }) => {
  return jwt.sign({ _id, roles }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {generate};