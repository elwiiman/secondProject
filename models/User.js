const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const passwordValidator = require("password-validator")

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
      required: true,
      resetPasswordToken:String,
      resetPasswordExpires:Date
    },
    
      
status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending"
    },
    role: {
      type: String,
      enum: ["artist", "fan"],
      required: true
    },
    user_picture: String
  },
  { timestamps: true }
);

const schema = new passwordValidator({
  lowercase:false,
  uppercase:false,
  minlength: 8,
  maxlength: 100,
  number:true
});

userSchema.plugin(passportLocalMongoose, {
  hashField: "password",
  usernameQueryFields: ["email", "username"]
});

module.exports = model("User", userSchema);
