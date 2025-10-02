const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.get("/getUserData", userAuth, (req, res) => {
  throw new Error("This is an error");
  res.send("User data sent!");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
