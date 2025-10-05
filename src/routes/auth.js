const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User saved successfully!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const isEmailValid = validator.isEmail(emailId);
    if (!isEmailValid) {
      throw new Error("Email is not valid!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });
      res.json({ data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successfully");
});

module.exports = router;
