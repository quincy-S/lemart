const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  const passwordCorrect =
    admin === null ? false : await bcrypt.compare(password, admin.passwordHash);

  if (!(admin && passwordCorrect)) {
    return res.status(401).json({
      error: `invalid username or password`,
    });
  }

  const adminForToken = {
    username: admin.username,
    id: admin._id,
  };
  const token = jwt.sign(adminForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: admin.username, name: admin.name });
});

module.exports = router;
