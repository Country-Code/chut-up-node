const jwt = require("jsonwebtoken");
const {logger} = require('../utils/tools');

const generate = (user) => {
  const { _id, roles } = user;
  logger.debug().log(user, "jwt.generate params")
  return jwt.sign({ _id, roles }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {generate};