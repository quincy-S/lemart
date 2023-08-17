const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const Buyer = require("../models/buyer");

//GET REQUESTS
router.get("/", async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

router.get("/:id", (req, res, next) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (!order) {
        return res
          .status(404)
          .send("The course with the given ID does not exist");
      }
      res.json(order);
    })
    .catch((error) => {
      next(error);
    });
});

//POST REQUESTS
router.post("/", async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const buyer = await Buyer.findById(decodedToken.id);

  const order = new Order({
    date: new Date(),
    buyer: req.body.buyer,
    purchases: req.body.purchases,
  });
  const savedOrder = await order.save();
  buyer.orders = buyer.orders.concat(savedOrder._id.toString());
  await buyer.save();
  res.json(savedOrder);
});

function getTokenFrom(request) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

function validateOrder(order) {
  const schema = Joi.object({
    buyer: Joi.string().min(5),
    purchases: Joi.array(),
    userId: Joi.string(),
  });
  return schema.validate(order);
}

module.exports = router;
