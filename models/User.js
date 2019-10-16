const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending"
    },
      role: {
        type: String,
        enum: ["tatuador", "user"],
        default: "user"
      },
    user_picture: String
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  hashField: "password",
  usernameQueryFields: ["email", "username"]
});

module.exports = model("User", userSchema);
