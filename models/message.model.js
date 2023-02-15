const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", schema);
