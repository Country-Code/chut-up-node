const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("../utils/jwt");

const getAll = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({
    users,
    status: "SUCCESS"
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id
  const user = await User.findById(userId);
  if (user) {
    res.json({
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
      },
      token: jwt.generate(user),
      status: "SUCCESS"
    });
  } else {
    res.status(404)
    throw new Error("he user not found!");
  }
});

const editProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404)
    throw new Error(`User with id : '${userId}' is not found!`);
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
    token: jwt.generate(user),
    status: "SUCCESS"
  });
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id;

  const result = await User.deleteOne({ _id: userId });

  if (result.deletedCount === 0) {
    res.status(404)
    throw new Error(`User with id : '${userId}' is not found!`);
  }

  res.json({
    message: 'User deleted successfully',
    status: "SUCCESS"
  });
});

module.exports = { getAll, getProfile, editProfile, deleteProfile };
