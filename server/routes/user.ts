import express from "express";
import { courses, user } from "../db/mongoose";
import {
  generateKeyForUser,
  userAuthentication,
  secretKeyForUser,
} from "../middlewares/middleware";
import { signup } from "../functionality/functions";

const app = express();

app.use(express.json());

interface courseStructure {
  _id?: any;
  title?: string;
  description?: string;
  price?: number;
  imageLink?: string;
  published?: boolean;
  CourseId?: number;
}

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
  console.log(req.body);
  let { username, password } = req.body;
  let isValid = await user.findOne({ username, password });
  console.log(username);
  if (isValid) {
    let token = generateKeyForUser(req.body, secretKeyForUser);
    console.log(token);
    res.send(`logged in successfully ${username}. token: ${token}`);
  } else {
    console.log("Invalid login", req);
    res.send("Invalid login");
  }
});

// Get the list of published courses for a user
app.get("/user/courses", userAuthentication, async (req, res) => {
  let publisedCourses = [];
  publisedCourses = await courses.find({ published: true });
  let finalList: courseStructure[] = [];
  publisedCourses.forEach((eachCourse) => {
    console.log(eachCourse);
    let tempObj: courseStructure = {};
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
    let CourseId = parseInt(req.params.Id);
    let username = req.headers.username;
    let publisedCourses = [];
    publisedCourses = await courses.find({ published: true });
    let courseToPurchase = publisedCourses.find(
      (eachCourse) => eachCourse.CourseId == CourseId
    );
    if (courseToPurchase && !(courseToPurchase == undefined)) {
      let cId = courseToPurchase.CourseId;
      let currUser = await user.findOne({ username });
      if (currUser && currUser.username == username) {
        let courseExists = currUser.coursesPurchased.find(
          (course: courseStructure) => {
            return course.CourseId == cId;
          }
        );
        if (!courseExists) {
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
      res.send(`Failed: course ${CourseId} doesn't exist`);
    }
  } catch (err) {
    res.send(err);
  }
});

// Get the list of purchased courses for a user
app.get("/user/purchasedCourses", userAuthentication, async (req, res) => {
  let username = req.headers.username;
  let coursesp = [];
  let currUser = await user.findOne({ username });
  if (currUser) {
    for (let eachCourseId of currUser.coursesPurchased) {
      let course = await courses.findOne({ _id: eachCourseId });
      if (course) {
        let tempObj: courseStructure = {};
        tempObj.title = course.title;
        tempObj.description = course.description;
        tempObj.price = course.price;
        tempObj.imageLink = course.imageLink;
        tempObj.CourseId = course.CourseId;
        coursesp.push(tempObj);
      }
    }
    res.json(coursesp);
  } else {
    res.send("You don't have any courses");
  }
});

// view a course by ID

app.get("/user/courses/:Id", userAuthentication, async (req, res) => {
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
