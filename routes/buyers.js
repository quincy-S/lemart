const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Buyer = require("../models/buyer");

router.post("/", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log(firstname, lastname, email, password);
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const buyer = new Buyer({
    firstname,
    lastname,
    email,
    passwordHash,
  });

  const savedBuyer = await buyer.save();
  res.status(201).json(savedBuyer);
});

module.exports = router;
