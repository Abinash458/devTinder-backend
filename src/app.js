const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.get("/admin/getAllUser", adminAuth, (req, res) => {
  res.send("All user data sent!");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted user");
});

app.get("/user/login", (req, res) => {
  res.send("Get Login Page");
});

app.get("/user/getUser", userAuth, (req, res) => {
  res.send("Single user data sent!");
});

app.get("/user/updateUser", userAuth, (req, res) => {
  res.send("Update user");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
