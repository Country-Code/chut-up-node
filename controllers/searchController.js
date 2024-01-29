const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const tools = require("../utils/tools");

const users = asyncHandler(async (req, res) => {
    const searchQuery = req.body.search_query;
    let users = await User.find({
        $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { email: { $regex: new RegExp(searchQuery, "i") } },
        ],
    })
        .limit(20)
        .lean();
    let allowedFields = ["_id", "fullname", "email", "image"];
    // let allowedFields = [];
    users = tools.object.filter(users, allowedFields);
    res.json({
        users,
        status: "SUCCESS",
        token: req.newToken,
    });
});

module.exports = { users };
