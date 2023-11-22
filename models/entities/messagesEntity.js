const mongoose = require("mongoose");

module.exports = mongoose.Schema(
  {
    chatName: { type: String, trim: true, required: true, unique:true},
    isGroupChat: { type: Boolean, default: false },
    // users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // latestMessage: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Message",
    // },
    // groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
