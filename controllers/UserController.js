const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("../utils/jwt");

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
    if (req.body.password) await user.setPassword(req.body.password);
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

module.exports = { getAll, getProfile, editProfile, deleteProfile };
