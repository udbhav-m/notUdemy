"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("../db/mongoose");
const middleware_1 = require("../middlewares/middleware");
const functions_1 = require("../functionality/functions");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// User routes
// User signup
app.post("/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let inputData = req.body;
        if (inputData.username.length < 1 || inputData.password.length < 1) {
            res.send("Invalid details");
        }
        let outp = yield (0, functions_1.signup)(inputData, "user");
        res.send(outp);
    }
    catch (err) {
        res.send(err);
    }
}));
// User login
app.post("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let { username, password } = req.body;
    let isValid = yield mongoose_1.user.findOne({ username, password });
    console.log(username);
    if (isValid) {
        let token = (0, middleware_1.generateKeyForUser)(req.body, middleware_1.secretKeyForUser);
        console.log(`Logged-in successfully. welcome ${username}. Token: ${token}`);
        res.json({ username: username, token: token });
    }
    else {
        console.log("Invalid login", req);
        res.send("Invalid login");
    }
}));
// Get the list of published courses for a user
app.get("/user/courses", middleware_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let publisedCourses = [];
    publisedCourses = yield mongoose_1.courses.find({ published: true });
    let finalList = [];
    publisedCourses.forEach((eachCourse) => {
        console.log(eachCourse);
        let tempObj = {};
        tempObj.title = eachCourse.title;
        tempObj.description = eachCourse.description;
        tempObj.price = eachCourse.price;
        tempObj.imageLink = eachCourse.imageLink;
        tempObj.CourseId = eachCourse.CourseId;
        finalList.push(tempObj);
    });
    res.json(finalList);
}));
// // Purchase a course by a user
app.post("/user/courses/:Id", middleware_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let CourseId = parseInt(req.params.Id);
        let username = req.headers.username;
        let publishedCourses = yield mongoose_1.courses.find({ published: true });
        let courseToPurchase = {};
        publishedCourses.forEach((eachCourse) => {
            if (eachCourse.CourseId === CourseId) {
                courseToPurchase = eachCourse;
            }
        });
        if (courseToPurchase) {
            let currentUser = yield mongoose_1.user.findOne({ username });
            if (currentUser) {
                // Check if the course ID is present in coursesPurchased
                const courseAlreadyPurchased = currentUser.coursesPurchased.some((purchasedCourseId) => purchasedCourseId.equals(courseToPurchase._id));
                if (!courseAlreadyPurchased) {
                    currentUser.coursesPurchased.push(courseToPurchase._id);
                    yield currentUser.save();
                    console.log({
                        message: `${currentUser.username}, course ${CourseId} purchased successfully`,
                    });
                    res.json({
                        message: `${currentUser.username}, course ${CourseId} purchased successfully`,
                    });
                }
                else {
                    console.log({
                        message: `${currentUser.username}, course ${CourseId} is purchased already`,
                    });
                    res.json({
                        message: `${currentUser.username}, course ${CourseId} is purchased already`,
                    });
                }
            }
        }
        else {
            res.json({ message: `Failed: course ${CourseId} doesn't exist` });
        }
    }
    catch (err) {
        res.json({ error: err.message });
    }
}));
// Get the list of purchased courses for a user
app.get("/user/purchasedCourses", middleware_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.headers.username;
    let coursesp = [];
    let currUser = yield mongoose_1.user.findOne({ username });
    if (currUser) {
        for (let eachCourseId of currUser.coursesPurchased) {
            let course = yield mongoose_1.courses.findOne({ _id: eachCourseId });
            if (course) {
                let tempObj = {};
                tempObj.title = course.title;
                tempObj.description = course.description;
                tempObj.price = course.price;
                tempObj.imageLink = course.imageLink;
                tempObj.CourseId = course.CourseId;
                coursesp.push(tempObj);
            }
        }
        res.json(coursesp);
    }
    else {
        res.send("You don't have any courses");
    }
}));
// view a course by ID
app.get("/user/courses/:Id", middleware_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseId = parseInt(req.params.Id);
        const course = yield mongoose_1.courses.findOne({ CourseId: courseId });
        if (course) {
            console.log({ success: `found the course ${course}` });
            res.send(course);
        }
        else {
            console.log({ failed: `the course with ${courseId} does not exist` });
            res.json({ failed: `the course with ${courseId} does not exist` });
        }
    }
    catch (error) {
        console.log({ error: error.message });
        res.json({ error: error.message });
    }
}));
exports.default = app;
