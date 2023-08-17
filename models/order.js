const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  id: Number,
  numberOrdered: Number,
});

const orderSchema = new mongoose.Schema({
  date: Date,
  buyer: String,
  purchases: [purchaseSchema],
});

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Order", orderSchema);
