const { Schema, mongoose, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userScheema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      minlength: [3, "minimum length is 3"],
      maxlength: [31, "maximum length is 31"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w\.-]+@[a-zA-Z\d-]+\.(com|com\.ph|org|net|edu|gov|mil|info|co|io|us|biz|me|co\.uk|[a-zA-Z]{2,})$/.test(v);
        },
        message: "please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "user Password is required"],
      minlength: [3, "minimum length is 3"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      // type: Buffer,
      // contentType: String,
      type: String,
      required: [true, "user Image is required"]
    },
    address: {
      type: String,
      required: [true, "user Address is required"],
    },
    phone: {
      type: String,
      required: [true, "user Phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
   
  },
  {
    timestamps: true,
  }
);

const User = model('users', userScheema);

module.exports = User;
