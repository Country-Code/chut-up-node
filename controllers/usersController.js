const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const tools = require('../utils/tools');

const getAll = asyncHandler(async (req, res) => {
    let users = await User.find();
    let allowedFields = ["_id", "fullname", "email"];
    // let allowedFields = [];
    users = tools.object.filter(users, allowedFields);
    res.json({
        users,
        status: "SUCCESS",
        token: req.newToken
    });
});

module.exports = {getAll}