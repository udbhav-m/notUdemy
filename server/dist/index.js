"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const app = (0, express_1.default)();
const port = 3000;
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
// Middleware
app.use((0, cors_1.default)({ origin: "*" }));
app.use(user_1.default);
app.use(admin_1.default);
// Connect to MongoDB
(0, mongoose_1.connect)("mongodb+srv://udbhav4:vasudhaM100@cluster0.qcvpegg.mongodb.net/");
// Start the server
app.listen(port, () => {
    console.log(`courses app is running on https://localhost:${port}`);
});
