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
// Admin routes
// Admin signup
app.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    let inputData = req.body;
    if (!username || !password) {
        console.log("Invalid details");
        res.json({ error: "Invalid details" });
    }
    else {
        try {
            const outp = yield (0, functions_1.signup)(inputData, "admin");
            res.json(outp);
        }
        catch (err) {
            res.json({ Error: err.message });
        }
    }
}));
// Admin login
app.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    let userExists = yield mongoose_1.admin.findOne({ username, password });
    if (userExists) {
        let token = (0, middleware_1.generateKeyForUser)(req.body, middleware_1.secretKeyForAdmins);
        console.log(`Logged-in successfully. welcome ${username}. Token: ${token}`);
        res.json({ username: username, token: token });
    }
    else {
        console.log(`Username/password Incorrect.`);
        res.json({ message: `Username/password Incorrect.` });
    }
}));
// Add a new course by an admin
app.post("/admin/courses", middleware_1.adminAuthentication, (req, res) => {
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
        (0, functions_1.createCourse)(courseinp, username)
            .then((outp) => {
            res.send(outp);
        })
            .catch((error) => {
            res.send(error);
        });
    }
    else {
        res.send("invalid data provided");
    }
});
// Get the list of courses published by an admin
app.get("/admin/courses", middleware_1.adminAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let username = req.headers.username;
        let creator = yield mongoose_1.admin.findOne({ username });
        let finalList = [];
        if (creator) {
            for (let eachCourseId of creator.coursesPublished) {
                let course = yield mongoose_1.courses.findOne({ _id: eachCourseId });
                if (course) {
                    let tempObj = {};
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
            }
            else {
                res.json(finalList);
            }
        }
    }
    catch (err) {
        res.send(err);
    }
}));
// Delete a course by Id
app.delete("/admin/courses/:Id", middleware_1.adminAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseId = parseInt(req.params.Id);
        let courseExists = yield mongoose_1.courses.findOne({ CourseId: courseId });
        if (courseExists) {
            let objId = courseExists._id;
            let adminUser = yield mongoose_1.admin.findOne({ username: courseExists.author });
            if (adminUser) {
                let adminCourses = adminUser.coursesPublished;
                let updatedCourses = adminCourses.filter((eachObjId) => eachObjId.toString() !== objId.toString());
                yield mongoose_1.courses.findOneAndRemove({ CourseId: courseId });
                adminUser.coursesPublished = updatedCourses;
                yield adminUser.save();
                console.log({ success: `Deleted course and updated with admin` });
                res.send({ success: `Deleted course and updated with admin` });
            }
            else {
                console.log({ Failed: `Admin user not found` });
                res.send({ Failed: `Admin user not found` });
            }
        }
        else {
            console.log({ Failed: `Course not found` });
            res.send({ Failed: `Course not found` });
        }
    }
    catch (error) {
        res.send({ error: error.message });
    }
}));
//update by ID
app.put("/admin/courses/:Id", middleware_1.adminAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseId = req.params.Id;
        let { title, description, price, imageLink, published } = req.body;
        if (title && description) {
            let courseExists = yield mongoose_1.courses.findOne({ CourseId: courseId });
            if (courseExists) {
                courseExists.title = title;
                courseExists.description = description;
                courseExists.price = price;
                courseExists.imageLink = imageLink;
                courseExists.published = published;
                yield courseExists.save();
                console.log({ success: `course details updated` });
                res.send({ success: `course details updated` });
            }
            else {
                console.log({ Failed: `course not found` });
                res.send({ Failed: `course not found` });
            }
        }
        else {
            console.log({ failed: `title and description cannot be empty` });
            res.send({ failed: `title and description cannot be empty` });
        }
    }
    catch (error) {
        console.log({ error: error.message });
        res.send({ error: error.message });
    }
}));
app.get("/admin/courses/:Id", middleware_1.adminAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseId = parseInt(req.params.Id);
        const course = yield mongoose_1.courses.findOne({ CourseId: courseId });
        if (course) {
            console.log({ success: `found the course ${course}` });
            res.send(course);
        }
        else {
            console.log({ failed: `the course with ${courseId} does not exist` });
            res.send({ failed: `the course with ${courseId} does not exist` });
        }
    }
    catch (error) {
        console.log({ error: error.message });
        res.send({ error: error.message });
    }
}));
exports.default = app;
