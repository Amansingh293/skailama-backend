const router = require("express").Router();

const User = require("../Models/userSchema");
const Project = require("../Models/projectSchema");
const File = require("../Models/fileSchema");

router.post("/create-user", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      const newUser = new User({
        email: request.body.email,
        userName: request.body.userName,
      });

      await newUser.save();

      const foundUser = await User.findOne({ email: request.body.email });
      response.status(200).json({
        data: foundUser,
      });
    } else {
      response.status(200).json({ message: "User Already Exists", data: user });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/get-user", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json("Internal Server Error");
  }
});

router.post("/get-all-projects", async (request, response) => {
  try {
    const allData = await User.findOne({ email: request.body.email }).populate(
      "projects"
    );

    if (!allData) {
      response.status(403).json({ message: "No user found !!" });
    }
    response.status(200).json(allData);
  } catch (error) {
    response.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/create-project", async (request, response) => {
  try {
    const defaultWidgetConfig = {
      general: {
        chatbot: "disabled",
        welcomeMessage: "Welcome to our platform!",
        inputMessage: "Please enter your query.",
      },
      display: {
        primaryColor: "#3498db",
        fontColor: "#2c3e50",
        fontSize: "14px",
        chatHeight: "500px",
        chatIcon: "chat-icon.png",
        positionOnScreen: "bottom-right",
        distanceFromBottom: "10px",
        horizontalDistance: "10px",
        botIcon: "https://s3.amazonaws.com/yourbucket/bot-icon.png",
      },
    };

    const newProject = new Project({
      projectName: request.body.projectName,
      projectDetails: [],
      widgetConfiguration:
        request.body.widgetConfiguration || defaultWidgetConfig,
    });

    const savedProject = await newProject.save();

    let user = await User.findOne({ email: request.body.email });

    user.projects.push(savedProject._id);

    await user.save();

    user = await user.populate("projects");

    console.log(user);

    response.status(201).json(user);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/get-project", async (request, response) => {
  try {
    const project = await Project.findById({ _id: request.body.pId }).populate(
      "projectDetails"
    );

    response.status(200).json(project);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/save-project", async (request, response) => {
  try {
    const project = await Project.findByIdAndUpdate(
      { _id: request.body.pId },
      request.body.project
    );
    const newProject = await project.populate("projectDetails");
    console.log(newProject);
    response.status(200).json(newProject);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-transcript", async (request, response) => {
  try {
    const file = await File.findByIdAndDelete({ _id: request.query.fileId });

    const project = await Project.findById({
      _id: request.query.projectId,
    }).populate("projectDetails");

    response.status(200).json(project);
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/editted-transcript", async (request, response) => {
  try {
    const file = await File.findById({ _id: request.body.id });

    file.description = request.body.description;

    await file.save();

    response.status(200).json(file);
  } catch (error) {}
});

router.post("/add-project-detials", async (request, response) => {
  try {
    const project = await Project.findById({ _id: request.body.pId });

    const newFile = new File({
      name: request.body.name,
      description: request.body.description,
    });

    const savedFile = await newFile.save();

    project.projectDetails.push(savedFile._id);

    await project.save();

    const updatedProject = await Project.findById({
      _id: request.body.pId,
    }).populate("projectDetails");

    response.status(200).json(updatedProject);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
