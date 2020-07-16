const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.post("/", async (req, res) => {
  if(!req.body.username){
    res.status(400).send("No user data provided");
  }

  const user = new User(req.body);
  await user.save();
  res.status(201).send();
});

module.exports = router;