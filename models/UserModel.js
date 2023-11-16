const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userEntity = require("./entities/UserEntity");

userEntity.methods.verifyPassword = async function (pw) {
  return await bcrypt.compare(pw, this.password);
};

userEntity.methods.createResetPasswordToken = async function () {
  const token = crypto.randomUUID()
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 60;
  await this.save()
  console.log(token, this.resetPasswordToken)

  return token;
};

userEntity.methods.cleanResetPasswordData = async function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordTokenExpires = undefined;
  await this.save()
  return true;
};

userEntity.methods.setPassword = async function (pw) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(pw, salt);
}

module.exports = mongoose.model("User", userEntity);
