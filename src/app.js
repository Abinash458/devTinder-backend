const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling the route user 01!!");
    next();
  },
  [
    (req, res, next) => {
      console.log("Handlig the route user 02!!");
      next();
    },
    (req, res, next) => {
      console.log("Handlig the route user 03!!");
      next();
    },
  ],
  (req, res, next) => {
    console.log("Handlig the route user 04!!");
    next();
  },
  (req, res, next) => {
    console.log("Handlig the route user 05!!");
    res.send("Response 05...");
  }
);

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
