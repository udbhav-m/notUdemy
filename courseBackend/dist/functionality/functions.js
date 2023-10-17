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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = exports.signup = void 0;
const mongoose_1 = require("../db/mongoose");
// Function for user signup or admin signup
function signup(input, type) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let username = input.username;
            let password = input.password;
            if (type == "admin") {
                let existingAdmin = yield mongoose_1.admin.findOne({ username });
                if (existingAdmin) {
                    console.log(`user: ${username} already exists`);
                    resolve({ message: `user ${username} already exists` });
                }
                else {
                    input.coursesPublished = [];
                    let coursesPublished = input.coursesPublished;
                    let newAdmin = new mongoose_1.admin({ username, password, coursesPublished });
                    yield newAdmin.save();
                    console.log(`Account created successfully ${input.username}`);
                    resolve({
                        success: `Account created successfully`,
                        done: true,
                    });
                }
            }
            if (type == "user") {
                let existingUser = yield mongoose_1.user.findOne({ username });
                if (existingUser) {
                    console.log(`user: ${username} already exists`);
                    resolve(`user: ${username} already exists`);
                }
                else {
                    input.coursesPurchased = [];
                    let coursesPurchased = input.coursesPurchased;
                    let newUser = new mongoose_1.user({ username, password, coursesPurchased });
                    yield newUser.save();
                    console.log(`Account created successfully ${input.username}`);
                    resolve({
                        success: `Account created successfully ${input.username}`,
                    });
                }
            }
        }
        catch (err) {
            console.log(`Account creation failed ${(input.username, err.message)}`);
            reject({
                message: `Account creation failed ${(input.username, err.message)}`,
            });
        }
    }));
}
exports.signup = signup;
// Function to create a new course
function createCourse(input, creator) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let newCourse = input;
            newCourse.CourseId = Math.floor(Math.random() * 1000);
            let { title, description, price, imageLink, published, CourseId } = newCourse;
            let coursesOfcreator = yield mongoose_1.admin.findOne({ username: creator });
            if (coursesOfcreator) {
                let coursesAlready = coursesOfcreator.coursesPublished;
                let newC = new mongoose_1.courses({
                    title,
                    description,
                    price,
                    imageLink,
                    published,
                    CourseId,
                    author: creator,
                });
                yield newC.save();
                coursesAlready.push(newC._id);
                yield mongoose_1.admin.findOneAndUpdate({ username: creator }, { coursesPublished: coursesAlready });
                console.log(`course ${newCourse.CourseId} added and associated with ${creator}`);
                resolve({
                    message: `course ${newCourse.CourseId} added and associated with ${creator}`,
                });
            }
        }
        catch (err) {
            console.log(`Failed to create course: ${err.message}`);
            reject(`Failed to create course: ${err.message}`);
        }
    }));
}
exports.createCourse = createCourse;
