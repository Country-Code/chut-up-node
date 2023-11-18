const mongoose = require("mongoose");
const rolesList = require("../../config/roles")
const rolesSchema = new mongoose.Schema(
  { value: {type: String, enum: [...rolesList] }}
);

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
    roles: {
      type: [{type: String, refs: rolesSchema}],
      default: [rolesList?.[0]],
      validate: {
        validator: function(roles) {
          let uniqueRoles = [...(new Set(roles))]
          return uniqueRoles
            .map(
              role => rolesList.includes(role)
            ).filter(
              included => included === false
            ).length === 0;
        },
        message: props => `The given value '${props.value}' includes invalid roles!`
      }
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
