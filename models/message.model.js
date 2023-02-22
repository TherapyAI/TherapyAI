const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "An user is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", schema);