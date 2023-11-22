const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const usersEntity = require("./entities/usersEntity");

usersEntity.methods.verifyPassword = async function (pw) {
  return await bcrypt.compare(pw, this.password);
};

usersEntity.methods.createResetPasswordToken = async function () {
  const token = crypto.randomUUID()
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 60;
  await this.save()
  console.log(token, this.resetPasswordToken)

  return token;
};

usersEntity.methods.cleanResetPasswordData = async function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordTokenExpires = undefined;
  await this.save()
  return true;
};

usersEntity.methods.setPassword = async function (pw) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(pw, salt);
}

usersEntity.methods.setRoles = async function (roles) {
  if (Array.isArray(roles) && roles.length > 0) {
    this.roles = [...(new Set(roles))]
  } else if (!Array.isArray(roles)) {
    this.roles = roles;
  }
}


module.exports = mongoose.model("users", usersEntity);
