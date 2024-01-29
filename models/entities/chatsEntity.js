const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        name: { type: String, trim: true },
        isGroup: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
        },
        groupAdmins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
    },
    { timestamps: true }
);
