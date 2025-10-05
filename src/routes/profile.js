const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditField,
  validateProfileEditData,
} = require("../utils/validation");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditField(req)) {
      throw new Error("Invalid edit request!");
    }
    validateProfileEditData(req);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    // await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (!isStrongPassword) {
      throw new Error("Enter a strong password");
    }

    const loggedInUser = req.user;
    const hashPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashPassword;
    loggedInUser.save();

    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Password update successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
