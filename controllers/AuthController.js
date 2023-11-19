
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("../utils/jwt");
const mailer = require("../config/mailer")

const register = asyncHandler(async (req, res) => {
  const { fullname, email, password, image, roles } = req.body;

  if (!fullname || !email || !password) {
    res.status(400)
    throw new Error("Please Enter all the Feilds");
  }

  const user = await User.findOne({ email });

  if (user) {
    res.status(400)
    throw new Error("User already exists");
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
  let token = jwt.generate(newUser);
  if (newUser) {
    res.status(201).json({
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        roles: newUser.roles,
        image: newUser.image,
      },
      token,
      status: "SUCCESS"
    });
  } else {
    res.status(400)
    throw new Error("Error while creating the user!");
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
      token: jwt.generate(user),
      status: "SUCCESS"
    });
  } else {
    res.status(401)
    throw new Error("Invalid Email or Password!");
  }
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404)
      throw new Error(`User with email '${email}' is not found.`);
    }
    let token = await user.createResetPasswordToken()
    console.log("token is :", token)
    console.log("typeof token is :", typeof token)
    let resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${token}`
    console.log("resetUrl is :", resetUrl)
    mailer.sendMail({
      to: user.email,
      html: `<a href="${resetUrl}">Change password</a>`
    }, (err) => {
      user.cleanResetPasswordData()
      throw err;
    }, () => {
      res.json({ message: `Password reset mail is sent to ${user.email}`, email: user.email, status: "SUCCESS" });
    })
  } catch (error) {
    res.status(500);
    throw error;
  }
});

const resetPasswordAction = asyncHandler(async (req, res) => {
  const { newPassword, resetPasswordToken } = req.body;

  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    res.status(404)
    throw new Error(`No User with this resetPasswordToken : '${resetPasswordToken}'.`);
  }
  if (user.resetPasswordTokenExpires < Date.now()) {
    res.status(400)
    throw new Error(`The resetPasswordToken is expired.`);
  }

  if (!newPassword) {
    res.status(400)
    throw new Error(`The new password is required!.`);
  }
  await user.setPassword(newPassword);
  await user.cleanResetPasswordData();
  res.json({ message: 'Password reseted successfully', status: "SUCCESS" });
});

module.exports = { register, login, resetPasswordRequest, resetPasswordAction };
