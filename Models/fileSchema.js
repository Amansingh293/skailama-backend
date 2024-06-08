const mongoose = require("mongoose");

// Schema for project details
const fileSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  time: {
    type: Date,
    required: true,
    default: new Date().getTime()
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
