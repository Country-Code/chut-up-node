const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("../utils/jwt");

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

    const newUser = await User.create({
      fullname,
      email,
      password,
      image,
      isAdmin
    });

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

const getAll = asyncHandler(async (req, res) => {

  try {
    const users = await User.find();
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          isAdmin: user.isAdmin,
          image: user.image,
        },
        token: jwt.generate(user._id)
      });
    } else {
      res.status(404).json({ message: "The user not found!", status: "KO" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "KO" });
  }
});

module.exports = { register, login, getAll, getProfile };
