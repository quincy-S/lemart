const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Buyer = require("../models/buyer");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const buyer = await Buyer.findOne({ email });
  const passwordCorrect =
    buyer === null ? false : await bcrypt.compare(password, buyer.passwordHash);

  if (!(buyer && passwordCorrect)) {
    return res.status(401).json({
      error: `invalid username or password`,
    });
  }

  const buyerForToken = {
    email: buyer.email,
    id: buyer._id,
  };
  const token = jwt.sign(buyerForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  res.status(200).send({ token, email: buyer.email });
});

module.exports = router;
