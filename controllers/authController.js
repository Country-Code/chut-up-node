
const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const jwt = require("../utils/jwt");
const {fs} = require("../utils/tools");
const mailer = require("../config/mailer")
const path = require("path");
const { authErrors } = require("../config/errorCodes")
const { errorUtil } = require("../utils/tools")

const register = asyncHandler(async (req, res) => {
  const { fullname, email, password, image, roles } = req.body;

  if (!fullname || !email || !password) {
    throw errorUtil.generateError(authErrors.register.fields.missed);
  }

  const user = await User.findOne({ email });

  if (user) {
    throw errorUtil.generateError(authErrors.register.user.exists);
  }

  const newUser = await new User({
    fullname,
    email,
    password,
    image
  });
  await newUser.setPassword(password);
  if (roles) await newUser.setRoles(roles);
  await newUser.save();
  if (newUser) {
    res.status(201).json({
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        roles: newUser.roles,
        image: newUser.image,
      },
      token: jwt.generateToken(newUser),
      status: "SUCCESS"
    });
  } else {
    throw errorUtil.generateError(authErrors.register.user.create);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.verifyPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        roles: user.roles,
        image: user.image,
      },
      token: jwt.generateToken(user),
      status: "SUCCESS"
    });
  } else {
    throw errorUtil.generateError(authErrors.login.credentials);
  }
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    console.log("Error code in ath : ", res.statusCode)
    throw errorUtil.generateError(authErrors.resetPasswordRequest.email, {email});
  }

  let token = await user.createResetPasswordToken()
  let resetUrl = `${req.headers.origin}/reset-password/${token}`
  console.log("resetPasswordRequest - resetUrl is :", resetUrl)
  let html = fs.read.file(path.resolve(__dirname, "../views/reset-password-mail.html"));
  html = html.replace('{resetUrl}', resetUrl);
  mailer.sendMail({
    to: user.email,
    html
  }, (err) => {
    user.cleanResetPasswordData()
    throw err;
  }, () => {
    res.json({
      message: `Password reset mail is sent to ${user.email}`,
      email: user.email,
      status: "SUCCESS"
    });
  })
});

const resetPasswordAction = asyncHandler(async (req, res) => {
  const { newPassword, resetPasswordToken } = req.body;

  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    throw errorUtil.generateError(authErrors.resetPasswordAction.token.invalid, {token: resetPasswordToken});
  }
  if (user.resetPasswordTokenExpires < Date.now()) {
    throw errorUtil.generateError(authErrors.resetPasswordAction.token.expired);
  }

  if (!newPassword) {
    throw errorUtil.generateError(authErrors.resetPasswordAction.password);
  }
  await user.setPassword(newPassword);
  await user.cleanResetPasswordData();
  res.json({
    message: 'Password reseted successfully',
    status: "SUCCESS"
  });
});

module.exports = { register, login, resetPasswordRequest, resetPasswordAction };
