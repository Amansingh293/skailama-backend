const mongoose = require("mongoose");

// Schema for general widget configuration
const generalConfigSchema = new mongoose.Schema({
  chatbot: { type: String, default: "" },
  welcomeMessage: { type: String, default: "Welcome to our platform!" },
  inputMessage: { type: String, default: "Please enter your query." },
});

// Schema for display widget configuration
const displayConfigSchema = new mongoose.Schema({
  primaryColor: { type: String, default: "#3498db" },
  fontColor: { type: String, default: "#2c3e50" },
  fontSize: { type: String, default: "14px" },
  chatHeight: { type: String, default: "500px" },
  chatIcon: { type: String, default: "chat-icon.png" },
  positionOnScreen: { type: String, default: "bottom-right" },
  distanceFromBottom: { type: String, default: "10px" },
  horizontalDistance: { type: String, default: "10px" },
  botIcon: {
    type: String,
    default: "https://s3.amazonaws.com/yourbucket/bot-icon.png",
  },
});

// Widget configuration schema, with defaults
const widgetConfigurationSchema = new mongoose.Schema(
  {
    general: { type: generalConfigSchema, default: {} },
    display: { type: displayConfigSchema, default: {} },
  },
  { _id: false }
);

// Project schema
const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  widgetConfiguration: { type: widgetConfigurationSchema, default: {} },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
