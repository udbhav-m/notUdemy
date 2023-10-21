import { admin, courses, user } from "../db/mongoose";

interface inputUser {
  username: string;
  password: string;
  coursesPublished?: any;
  coursesPurchased?: any;
}

interface courseStructure {
  _id?: any;
  title?: string;
  description?: string;
  price?: number;
  imageLink?: string;
  published?: boolean;
  CourseId?: number;
}

// Function for user signup or admin signup
function signup(input: inputUser, type: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = input.username;
      let password = input.password;

      if (type == "admin") {
        let existingAdmin = await admin.findOne({ username });
        if (existingAdmin) {
          console.log(`user: ${username} already exists`);
          resolve({ message: `user ${username} already exists` });
        } else {
          input.coursesPublished = [];
          let coursesPublished = input.coursesPublished;
          let newAdmin = new admin({ username, password, coursesPublished });
          await newAdmin.save();
          console.log(`Account created successfully ${input.username}`);
          resolve({
            success: `Account created successfully`,
            done: true,
          });
        }
      }
      if (type == "user") {
        let existingUser = await user.findOne({ username });
        if (existingUser) {
          console.log(`user: ${username} already exists`);
          resolve(`user: ${username} already exists`);
        } else {
          input.coursesPurchased = [];
          let coursesPurchased = input.coursesPurchased;
          let newUser = new user({ username, password, coursesPurchased });
          await newUser.save();
          console.log(`Account created successfully ${input.username}`);
          resolve({
            success: `Account created successfully ${input.username}`,
          });
        }
      }
    } catch (err: any) {
      console.log(`Account creation failed ${(input.username, err.message)}`);
      reject({
        message: `Account creation failed ${(input.username, err.message)}`,
      });
    }
  });
}

// Function to create a new course
function createCourse(input: courseStructure, creator: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let newCourse = input;
      newCourse.CourseId = Math.floor(Math.random() * 1000);
      let { title, description, price, imageLink, published, CourseId } =
        newCourse;
      let coursesOfcreator = await admin.findOne({ username: creator });
      if (coursesOfcreator) {
        let coursesAlready = coursesOfcreator.coursesPublished;
        let newC = new courses({
          title,
          description,
          price,
          imageLink,
          published,
          CourseId,
          author: creator,
        });
        await newC.save();
        coursesAlready.push(newC._id);

        await admin.findOneAndUpdate(
          { username: creator },
          { coursesPublished: coursesAlready }
        );
        console.log(
          `course ${newCourse.CourseId} added and associated with ${creator}`
        );
        resolve({
          message: `course ${newCourse.CourseId} added and associated with ${creator}`,
        });
      }
    } catch (err: any) {
      console.log(`Failed to create course: ${err.message}`);
      reject(`Failed to create course: ${err.message}`);
    }
  });
}

export { signup, createCourse };
