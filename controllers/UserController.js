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
    const userId = req.token.id
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

const editProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: `User with id : '${userId}' is not found"` });
    }

    if (req.body.fullname) user.fullname = req.body.fullname;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.image) user.image = req.body.image;
    if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
      token: jwt.generate(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: "KO" });
  }
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id;

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `User with id : '${userId}' is not found"` });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error : ${error.message} ` });
  }
});

module.exports = { register, login, getAll, getProfile, editProfile, deleteProfile };
