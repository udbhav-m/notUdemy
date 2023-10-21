import express from "express";
import { admin, courses, user } from "../db/mongoose";
import {
  generateKeyForUser,
  adminAuthentication,
  secretKeyForAdmins,
} from "../middlewares/middleware";

import { createCourse, signup } from "../functionality/functions";
import { inputvalues, courseStructure } from "../common/common";

const app = express();

app.use(express.json());
// Admin routes

// Admin signup
app.post("/admin/signup", async (req, res) => {
  let inputData = inputvalues.safeParse(req.body);
  if (!inputData.success) {
    return res.status(411).json({
      message: "not a valid input",
    });
  } else {
    try {
      const outp = await signup(inputData.data, "admin");
      res.json(outp);
    } catch (err: any) {
      res.json({ Error: err.message });
    }
  }
});

// Admin login
app.post("/admin/login", async (req, res) => {
  let inputData = inputvalues.safeParse(req.body);
  if (!inputData.success) {
    return res.status(411).json({
      message: "not a valid input",
    });
  }
  let { username, password } = inputData.data;

  let userExists = await admin.findOne({ username, password });
  if (userExists) {
    let token = generateKeyForUser(req.body, secretKeyForAdmins);
    console.log(`Logged-in successfully. welcome ${username}. Token: ${token}`);
    res.json({ username: username, token: token });
  } else {
    console.log(`Username/password Incorrect.`);
    res.json({ message: `Username/password Incorrect.` });
  }
});

// Add a new course by an admin
app.post("/admin/courses", adminAuthentication, (req, res) => {
  let username = req.headers.username;
  let courseinp = req.body;
  let valid = false;
  var check = ["title", "description", "price", "imageLink", "published"];

  for (let each in courseinp) {
    if (courseinp[each].length > 1 && check.includes(each)) {
      valid = true;
    }
  }

  if (valid && typeof username === "string") {
    createCourse(courseinp, username)
      .then((outp) => {
        res.send(outp);
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send("invalid data provided");
  }
});

// Get the list of courses published by an admin
app.get("/admin/courses", adminAuthentication, async (req, res) => {
  try {
    let username = req.headers.username;
    let creator = await admin.findOne({ username });
    let finalList = [];
    if (creator) {
      for (let eachCourseId of creator.coursesPublished) {
        let course = await courses.findOne({ _id: eachCourseId });
        if (course) {
          let tempObj: courseStructure = {};

          tempObj.title = course.title;
          tempObj.description = course.description;
          tempObj.price = course.price;
          tempObj.imageLink = course.imageLink;
          tempObj.published = course.published;
          tempObj.CourseId = course.CourseId;
          finalList.push(tempObj);
        }
      }
      if (!finalList) {
        res.json({ Message: "No courses Published" });
      } else {
        res.json(finalList);
      }
    }
  } catch (err) {
    res.send(err);
  }
});

// Delete a course by Id
app.delete("/admin/courses/:Id", adminAuthentication, async (req, res) => {
  try {
    let courseId = parseInt(req.params.Id);
    let courseExists = await courses.findOne({ CourseId: courseId });
    if (courseExists) {
      let objId = courseExists._id;
      let adminUser = await admin.findOne({ username: courseExists.author });
      if (adminUser) {
        let adminCourses = adminUser.coursesPublished;
        let updatedCourses = adminCourses.filter(
          (eachObjId) => eachObjId.toString() !== objId.toString()
        );
        await courses.findOneAndRemove({ CourseId: courseId });
        adminUser.coursesPublished = updatedCourses;
        await adminUser.save();
        console.log({ success: `Deleted course and updated with admin` });
        res.send({ success: `Deleted course and updated with admin` });
      } else {
        console.log({ Failed: `Admin user not found` });
        res.send({ Failed: `Admin user not found` });
      }
    } else {
      console.log({ Failed: `Course not found` });
      res.send({ Failed: `Course not found` });
    }
  } catch (error: any) {
    res.send({ error: error.message });
  }
});

//update by ID
app.put("/admin/courses/:Id", adminAuthentication, async (req, res) => {
  try {
    let courseId = req.params.Id;
    let { title, description, price, imageLink, published } = req.body;
    if (title && description) {
      let courseExists = await courses.findOne({ CourseId: courseId });
      if (courseExists) {
        courseExists.title = title;
        courseExists.description = description;
        courseExists.price = price;
        courseExists.imageLink = imageLink;
        courseExists.published = published;
        await courseExists.save();
        console.log({ success: `course details updated` });
        res.send({ success: `course details updated` });
      } else {
        console.log({ Failed: `course not found` });
        res.send({ Failed: `course not found` });
      }
    } else {
      console.log({ failed: `title and description cannot be empty` });
      res.send({ failed: `title and description cannot be empty` });
    }
  } catch (error: any) {
    console.log({ error: error.message });
    res.send({ error: error.message });
  }
});

app.get("/admin/courses/:Id", adminAuthentication, async (req, res) => {
  try {
    let courseId = parseInt(req.params.Id);
    const course = await courses.findOne({ CourseId: courseId });
    if (course) {
      console.log({ success: `found the course ${course}` });
      res.send(course);
    } else {
      console.log({ failed: `the course with ${courseId} does not exist` });
      res.send({ failed: `the course with ${courseId} does not exist` });
    }
  } catch (error: any) {
    console.log({ error: error.message });
    res.send({ error: error.message });
  }
});

export default app;
