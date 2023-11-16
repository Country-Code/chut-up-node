
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("../utils/jwt");
const mailer = require("../config/mailer")

const register = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password, image, isAdmin } = req.body;

    if (!fullname || !email || !password) {
      res
        .status(400)
        .json({ message: "Please Enter all the Feilds", status: "KO" });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists", status: "KO" });
    }

    const newUser = await new User({
      fullname,
      email,
      password,
      image,
      isAdmin
    });
    await newUser.setPassword(password);
    await newUser.save();

    if (newUser) {
      res.status(201).json({
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          image: newUser.image,
        },
        token: jwt.generate(newUser._id),
      });
    } else {
      res
        .status(400)
        .json({ message: "Error while creating the user!", status: "KO" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, status: "KO" });
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
        isAdmin: user.isAdmin,
        image: user.image,
      },
      token: jwt.generate(user._id),
    });
  } else {
    res
      .status(401)
      .json({ message: "Invalid Email or Password", status: "KO" });
  }
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `User with email '${email}' is not found.` });
    }
    let token = await user.createResetPasswordToken()
    console.log("token is :", token)
    console.log("typeof token is :", typeof token)
    let resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${token}`
    console.log("resetUrl is :", resetUrl)
    mailer.sendMail({
        to: user.email,
        html: `<a href="${resetUrl}">Change password</a>`
    },(err) => {
      user.cleanResetPasswordData()
      throw err;
    },() => {
      res.json({ message: `Password reset mail is sent to ${user.email}`, email: user.email, status: "SUCCESS" });
    })
  } catch (error) {
    res.status(500);
    throw error;
  }
});

const resetPasswordAction = asyncHandler(async (req, res) => {
  const {newPassword, resetPasswordToken } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken });

    if (!user) {
      return res.status(404).json({ message: `No User with this resetPasswordToken : '${resetPasswordToken}'.` });
    }
    if (user.resetPasswordTokenExpires < Date.now()) {
      return res.status(400).json({ message: `The resetPasswordToken is expired.` });
    }
    
    if (!newPassword) {
      return res.status(400).json({ message: `The new password is required!.` });
    }
    await user.setPassword(newPassword);
    await user.cleanResetPasswordData();
    res.json({ message: 'Password reseted successfully' });

  } catch (error) {
    throw new Error(`Error while reseting password : ${error.meassage}`);
  }
});

module.exports = { register, login, resetPasswordRequest, resetPasswordAction};
