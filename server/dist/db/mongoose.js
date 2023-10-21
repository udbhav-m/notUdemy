"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.user = exports.courses = exports.admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose Schema and Models
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    coursesPublished: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "courses" }],
});
const coursesSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
    CourseId: Number,
    author: String,
});
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    coursesPurchased: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "courses" }],
});
exports.userSchema = userSchema;
const admin = mongoose_1.default.model("admin", adminSchema);
exports.admin = admin;
const courses = mongoose_1.default.model("courses", coursesSchema);
exports.courses = courses;
const user = mongoose_1.default.model("user", userSchema);
exports.user = user;
