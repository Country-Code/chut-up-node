const asyncHandler = require("express-async-handler");
const chatModel = require("../models/chatsModel");
const userModel = require("../models/usersModel");
const jwt = require("../utils/jwt");

const getById = asyncHandler(async (req, res) => {
    const chatId = req.params.id;

    let chat = await chatModel
        .findOne({
            _id: chatId,
        })
        .populate("users", "-password")
        .populate("lastMessage");

    chat = await userModel.populate(chat, {
        path: "lastMessage.sender",
        select: "name pic email",
    });

    if (chat) {
        res.json({
            chat,
            token: req.newToken,
            status: "SUCCESS",
        });
    } else {
        res.status(404);
        throw new Error("The chat requested is Not Found!");
    }
});

const getUserChat = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(400);
        throw new Error("the 'userId' is required!");
    }

    let chat = await chatModel
        .findOne({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: req.payload._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        .populate("users", "-password")
        .populate("lastMessage");

    chat = await userModel.populate(chat, {
        path: "lastMessage.sender",
        select: "name pic email",
    });

    if (chat) {
        res.json({
            chat,
            isNewChat: false,
            token: req.newToken,
            status: "SUCCESS",
        });
    } else {
        let chatData = {
            name: "sender",
            isGroup: false,
            users: [req.payload._id, userId],
        };

        const createdChat = await chatModel.create(chatData);
        const chat = await chatModel
            .findOne({ _id: createdChat._id })
            .populate("users", "-password");
        res.status(201).json({
            chat,
            isNewChat: true,
            token: req.newToken,
            status: "SUCCESS",
        });
    }
});

const getAll = asyncHandler(async (req, res) => {
    try {
        chatModel
            .find({ users: { $elemMatch: { $eq: req.payload._id } } })
            .populate("users", "-password")
            .populate("groupAdmins", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .then(async (chats) => {
                chats = await userModel.populate(chats, {
                    path: "lastMessage.sender",
                    select: "name pic email",
                });
                res.json({
                    chats,
                    token: req.newToken,
                    status: "SUCCESS",
                });
            });
    } catch (error) {
        res.status(400);
        throw error;
    }
});

const create = asyncHandler(async (req, res) => {
    const isGroupNameRequired =
        process.env.CHATS_IS_GROUP_NAME_REQUIRED ?? false;
    const isNewGroupEnabled = process.env.CHATS_IS_NEW_GROUP_ENABLED ?? false;

    if (
        !req.body.users ||
        (isGroupNameRequired && req.body.isGroup && !req.body.name)
    ) {
        res.status(400);
        throw new Error("Required fields are missed!");
    }

    let users = req.body.users;

    if (users.length < 1) {
        res.status(400);
        throw new Error(
            "at least one user must be given to form a conversation"
        );
    }

    users.push(req.payload._id);
    // Remove duplicate users
    users = Array.from(new Set(users));
    let chat = await chatModel.findOne({
        users: { $in: users },
        isGroup: req.body.isGroup,
    });

    if (!chat || (req.body.isGroup && isNewGroupEnabled)) {
        chat = await chatModel.create({
            users,
            isGroup: req.body.isGroup,
        });

        if (req.body.isGroup) {
            chat.name = req.body.name;
            chat.groupAdmins = req.payload._id;
        }

        await chat.save();
    }

    chatFitted = await chatModel
        .findOne({ _id: chat._id })
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
    res.status(201).json({
        chat: chatFitted,
        token: req.newToken,
        status: "SUCCESS",
    });
});

const rename = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const chatId = req.params.id;

    const updatedChat = await chatModel
        .findByIdAndUpdate(
            chatId,
            {
                name: name,
            },
            {
                new: true,
            }
        )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("The chat requested is Not Found!");
    } else {
        res.json({
            updatedChat,
            token: req.newToken,
            status: "SUCCESS",
        });
    }
});

const addUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const chatId = req.params.id;

    let chatGroup = await chatModel.findById(chatId);
    if (!chatGroup) {
        res.status(404);
        throw new Error("The chat requested is Not Found!");
    } else if (!chatGroup.groupAdmins.includes(req.payload._id)) {
        res.status(403);
        throw new Error("The user is not an admin.");
    }

    let user = await userModel.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User to add not found!");
    } else if (chatGroup.users.includes(userId)) {
        res.status(409);
        throw new Error("User is already a member of the group");
    }

    const added = await chatModel
        .findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");

    res.json({
        added,
        token: req.newToken,
        status: "SUCCESS",
    });
});

const removeUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const chatId = req.params.id;

    let chatGroup = await chatModel.findById(chatId);
    if (!chatGroup) {
        res.status(404);
        throw new Error("The chat requested is Not Found!");
    } else if (!chatGroup.groupAdmins.includes(req.payload._id)) {
        res.status(403);
        throw new Error("The user is not an admin.");
    }

    if (!chatGroup.users.includes(userId)) {
        res.status(409);
        throw new Error("User is not a member of the group!");
    }

    const removed = await chatModel
        .findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");

    res.json({
        message: "The user is removed from the chat group successfully!",
        removed,
        token: req.newToken,
        status: "SUCCESS",
    });
});

const leave = asyncHandler(async (req, res) => {
    const chatId = req.params.id;
    const userId = req.payload._id;

    let chatGroup = await chatModel.findById(chatId);
    if (!chatGroup) {
        res.status(404);
        throw new Error("The chat requested is Not Found!");
    }

    if (!chatGroup.users.includes(userId)) {
        res.status(409);
        throw new Error("User is not a member of the group!");
    }

    await chatModel
        .findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        })
        .populate("users", "-password")
        .populate("groupAdmins", "-password");

    res.json({
        message: "The user is removed from the chat group successfully!",
        token: req.newToken,
        status: "SUCCESS",
    });
});

module.exports = {
    getById,
    getAll,
    create,
    getUserChat,
    rename,
    addUser,
    removeUser,
    leave,
};
