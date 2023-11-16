const mongoose = require("mongoose");

module.exports = mongoose.Schema(
  {
    fullname: {
      type: "String",
      required: true,
      trim: true,
      maxlength: [20, "max characters is 20!"],
      minlength: [2, "min characters is 2!"],
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: {
      type: "String",
      required: true,
      minlength: [2, "min characters is 2!"],
    },
    image: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: "String"
    },
    resetPasswordTokenExpires:  {
      type: "Date"
    },
  },
  { timestaps: true }
);
