const express = require("express");
const config = require("./utils/config");
const app = express();
const buyersRouter = require("./routes/buyerslogin");
const mongoose = require("mongoose");
const ordersRouter = require("./routes/orders");
const buyersLoginRouter = require("./routes/buyerslogin");
const adminRouter = require("./routes/admin");
const adminLoginRouter = require("./routes/adminlogin");

const cors = require("cors");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    console.log(`connected to MongoDB`);
  })
  .catch((error) =>
    console.error(`Error connecting to MongoDB, ${error.message}`)
  );

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use("/api/admin", adminRouter);
app.use("/api/adminlogin", adminLoginRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/buyerslogin", buyersLoginRouter);
app.use("/api/buyers", buyersRouter);

module.exports = app;

// quincy
// 5K1ZipT85aruOQI0
