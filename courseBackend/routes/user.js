const express = require("express");
const { courses, user } = require("../db/mongoose");
const {
  generateKeyForUser,
  userAuthentication,
  secretKeyForUser,
} = require("../middlewares/middleware");
const { signup } = require("../functionality/functions");

const app = express();

app.use(express.json());

// User routes

// User signup
app.post("/user/signup", async (req, res) => {
  try {
    let inputData = req.body;
    if (inputData.username.length < 1 || inputData.password.length < 1) {
      res.send("Invalid details");
    }

    let outp = await signup(inputData, "user");
    res.send(outp);
  } catch (err) {
    res.send(err);
  }
});

// User login
app.post("/user/login", async (req, res) => {
  let { username, password } = req.headers;
  let isValid = await user.findOne({ username, password });
  if (isValid) {
    let token = generateKeyForUser(req.headers, secretKeyForUser);
    console.log(token);
    res.send(`logged in successfully ${username}. token: ${token}`);
  } else {
    console.log("Invalid login");
    res.send("Invalid login");
  }
});

// Get the list of published courses for a user
app.get("/user/courses", userAuthentication, async (req, res) => {
  let publisedCourses = [];
  publisedCourses = await courses.find({ published: true });
  let finalList = [];
  publisedCourses.forEach((eachCourse) => {
    let tempObj = {};
    tempObj.title = eachCourse.title;
    tempObj.description = eachCourse.description;
    tempObj.price = eachCourse.price;
    tempObj.imageLink = eachCourse.imageLink;
    tempObj.CourseId = eachCourse.CourseId;
    finalList.push(tempObj);
  });
  res.json(finalList);
});

// // Purchase a course by a user
app.post("/user/courses/:Id", userAuthentication, async (req, res) => {
  try {
    let CourseId = req.params.Id;
    let username = req.user.username;
    let publisedCourses = [];
    publisedCourses = await courses.find({ published: true });
    let courseToPurchase = publisedCourses.find(
      (eachCourse) => eachCourse.CourseId == CourseId
    );
    if (courseToPurchase) {
      let currUser = await user.findOne({ username });
      if (currUser.username == username) {
        let courseExists = currUser.coursesPurchased.find(
          (course) => course.CourseId == courseToPurchase.CourseId
        );
        if (!courseExists) {
          currUser.coursesPurchased.push(courseToPurchase);
          let objId = courseToPurchase._id;
          await user.findOneAndUpdate(
            { username: username },
            { coursesPurchased: [objId] }
          );
          console.log(
            `${username}, course ${courseToPurchase.CourseId} is purchased successfully`
          );
          res.send(
            `${username}, course ${courseToPurchase.CourseId} is purchased successfully`
          );
        } else {
          console.log(
            `${username}, course ${courseToPurchase.CourseId} is already purchased`
          );
          res.send(
            `${username}, course ${courseToPurchase.CourseId} is already purchased`
          );
        }
      }
    } else {
      res.send(`Failed: course ${courseToPurchase.CourseId} doesn't exist`);
    }
  } catch (err) {
    res.send(err);
  }
});

// Get the list of purchased courses for a user
app.get("/user/purchasedCourses", userAuthentication, async (req, res) => {
  let username = req.user.username;
  let coursesp = [];
  let currUser = await user.findOne({ username });
  if (currUser) {
    for (let eachCourseId of currUser.coursesPurchased) {
      let course = await courses.findOne({ _id: eachCourseId });
      let tempObj = {};
      tempObj.title = course.title;
      tempObj.description = course.description;
      tempObj.price = course.price;
      tempObj.imageLink = course.imageLink;
      tempObj.CourseId = course.CourseId;
      coursesp.push(tempObj);
    }
    res.json(coursesp);
  } else {
    res.send("You don't have any courses");
  }
});

module.exports = app;
