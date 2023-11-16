const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userEntity = require("./entities/UserEntity");

userEntity.methods.verifyPassword = async function (pw) {
  return await bcrypt.compare(pw, this.password);
};

userEntity.methods.createResetPasswordToken = async function (pw) {
  const token = crypto.randomUUID()
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 60;

  console.log(token, this.resetPasswordTokens)

  return token;
};

userEntity.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userEntity);
