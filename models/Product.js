const mongoose = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    photo: {
      type: String,
    },
  owner: {
    ref:"User",
    type: Schema.Types.ObjectId
  }  
},
{
  timestamps: {
    createdAt: "createdAt",
    updatedAt:"updatedAt",
    }
  }
)

module.exports = model("Product", productSchema)