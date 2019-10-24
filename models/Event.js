const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    firstTime: Boolean,
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    tatoo_size: {
      type: String,
      enum: ["1 - 5 cm", "6 - 10 cm", "11 - 20 cm", "21 - 30 cm", "+30 cm"],
      required: true
    },
    body_part: {
      type: String,
      required: true
    },
    tatoo: {
      type: Schema.Types.ObjectId,
      ref: "Tatoo",
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = model("Event", eventSchema);
