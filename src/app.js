const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Abinash", lastname: "Mohapatra" });
});

app.post("/user", (req, res) => {
  res.send("Data inserted succesfully!");
});

app.patch("/user", (req, res) => {
  res.send("User updated successfully!");
});

app.delete("/user", (req, res) => {
  res.send("User remove successfully!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

app.use("/test", (req, res) => {
  res.send("Hello from test route!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
