const asyncHandler = require("express-async-handler");
const { Router } = require("express");
const router = Router();
const userController = require("../controllers/usersController");
const chatModel = require("../models/chatsModel");

const example = (req, res) => {
    let data = {};
    data.y = "middlewaresConfig";
    data.x = "crudRouter.stack.map((st) => st.route)";
    let message = "crudRouter";

    res.json({ message, data });
};

const getAllChats = asyncHandler(async (req, res) => {
    let chats = await chatModel.find().select("name");
    res.json({ chats });
});

const errorAction = (req, res) => {
    res.status(444);
    throw new Error("error message");
};

router.route("/users").get(userController.getAll);
router.route("/chats").get(getAllChats);
router.route("/error").post(errorAction);

module.exports = router;
