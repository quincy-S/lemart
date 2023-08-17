const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const admin = new Admin({
    username,
    passwordHash,
  });

  const savedAdmin = await admin.save();
  res.status(201).json(savedAdmin);
});

module.exports = router;
