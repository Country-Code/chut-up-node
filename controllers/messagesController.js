const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messagesModel");
const chatModel = require("../models/chatsModel");

const getAllByChat = asyncHandler(async (req, res) => {
    const messages = await messageModel.find({ chat: req.params.id })
        .populate("sender", "fullname email")
        .populate("chat", "name");
    res.json({
        messages,
        token: req.token,
        status: "SUCCESS"
    });
});

const send = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    const userId = req.payload._id;

    if (!content || !chatId) {
        res.status(400);
        throw new Error("Required fields are missed!");
    }

    let messageData = {
        sender: userId,
        content: content,
        chat: chatId,
        readBy: userId
    };

    let message = await messageModel.create(messageData);

    message = await message.populate("sender", "fullname email");
    message = await message.populate("chat", "name");

    await chatModel.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

    res.json({
        message,
        token: req.token,
        status: "SUCCESS"
    });
});

const read = asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const userId = req.payload._id;
    let message = await messageModel.findById(messageId);
    if (!message) {
        res.status(404);
        throw new Error("The message requested is Not Found!");
    } else if (message.readBy.includes(userId)) {
        res.status(409);
        throw new Error("The user has already read this message!")
    }

    message = await messageModel.findByIdAndUpdate(
        messageId, 
        {
            $push: { readBy: userId },
        },
        {
            new: true
        }
    );

    res.json({
        message,
        token: req.token,
        status: "SUCCESS"
    });
});

module.exports = { getAllByChat, send, read };
