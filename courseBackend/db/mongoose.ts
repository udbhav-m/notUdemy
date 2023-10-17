import mongoose from "mongoose";

// Mongoose Schema and Models
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  coursesPublished: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

const coursesSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  CourseId: Number,
  author: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  coursesPurchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

const admin = mongoose.model("admin", adminSchema);
const courses = mongoose.model("courses", coursesSchema);
const user = mongoose.model("user", userSchema);

export { admin, courses, user, userSchema };
