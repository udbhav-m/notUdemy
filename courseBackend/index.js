const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const adminApp = require("./routes/admin");
const userApp = require("./routes/user");

// Middleware
app.use(cors({ origin: "*" }));
app.use(userApp);
app.use(adminApp);

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://udbhav4:vasudhaM100@cluster0.qcvpegg.mongodb.net/"
);

// Start the server
app.listen(port, () => {
  console.log(`courses app is running on https://localhost:${port}`);
});
