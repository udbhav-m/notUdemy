import express from "express";
import cors from "cors";
import { connect } from "mongoose";
const app = express();
const port = 3000;

import adminApp from "./routes/admin";
import userApp from "./routes/user";

// Middleware
app.use(cors({ origin: "*" }));
app.use(userApp);
app.use(adminApp);

// Connect to MongoDB
connect("mongodb+srv://udbhav4:vasudhaM100@cluster0.qcvpegg.mongodb.net/");

// Start the server
app.listen(port, () => {
  console.log(`courses app is running on https://localhost:${port}`);
});
