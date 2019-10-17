const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tatooSchema = new Schema(
  {
    authorArtist: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      minlength: 1
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
    }
  },
  { timestamps: true }
);

module.exports = model("Tatoo", tatooSchema);
