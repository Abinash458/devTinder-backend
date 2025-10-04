const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.post("/sendConnectionsRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " Sent a connection request");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = router;
