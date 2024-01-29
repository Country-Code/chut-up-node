const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const { profileErrors } = require("../config/errorCodes");
const { errorUtil } = require("../utils/tools");

const getAll = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json({
        users,
        status: "SUCCESS",
    });
});

const getProfile = asyncHandler(async (req, res) => {
    console.log("getProfile CALL :");
    const userId = req.payload._id;
    let user = null;
    try {
        user = await User.findById(userId);
    } catch (error) {
        if (error.message.includes("buffering timed out after")) {
            throw errorUtil.generateError(profileErrors.timeout);
        }
        throw error;
    }
    console.log("getProfile - user : ", user);
    if (user) {
        res.json({
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
            },
            token: req.newToken,
            status: "SUCCESS",
        });
    } else {
        throw errorUtil.generateError(profileErrors.notfound, { userId });
    }
});

const editProfile = asyncHandler(async (req, res) => {
    const userId = req.payload._id;

    const user = await User.findById(userId);

    if (!user) {
        throw errorUtil.generateError(profileErrors.notfound, { userId });
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
        token: req.newToken,
        status: "SUCCESS",
    });
});

const deleteProfile = asyncHandler(async (req, res) => {
    const userId = req.payload._id;

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
        throw errorUtil.generateError(profileErrors.notfound, { userId });
    }

    res.json({
        message: "User deleted successfully",
        status: "SUCCESS",
    });
});

module.exports = { getAll, getProfile, editProfile, deleteProfile };
