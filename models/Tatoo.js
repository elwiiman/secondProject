const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tatooSchema = new Schema(
  {
    authorArtist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      value: { type: String, required: true },
      currency: {
        type: String,
        enum: ["MXN", "USD"]
      }
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["sold", "for sale"],
      default: "for sale"
    },
    exec_time: {
      type: Number,
      enum: [1, 1.5, 2, 2.5, 3],
      required: true
    },
    size: {
      type: String,
      enum: ["1 - 5 cm", "6 - 10 cm", "11 - 20 cm", "21 - 30 cm", "+30 cm"],
      required: true
    },
    acquiredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },
    body_part: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = model("Tatoo", tatooSchema);
