const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User saved successfully!");
  } catch (error) {
    res.status(400).send("Error saving the User: " + error.message);
  }
});

app.get("/userById", async (req, res) => {
  try {
    const user = await User.findById("68de6242730b958a35cd9b3b");
    if (!user) {
      res.send("User not found!");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: "abinash@gmail.com" });
    if (!user) {
      res.send("User not found!");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
