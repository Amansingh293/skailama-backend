const express = require("express");
const app = express();
const port = 3003;

const cors = require("cors");
require("dotenv").config();
require("./dbConfig/config");

app.use(cors());
app.use(express.json());

const userRoute = require("./Routes/userRoute");
const generateUploadURL = require("./s3");

app.use("/user", userRoute);

app.get("/s3-url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
