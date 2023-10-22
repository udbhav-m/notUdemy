/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import SignIn from "./components/signIn/SignIn.jsx";
import { Route } from "react-router-dom";
import "./App.css";
import SignUp from "./components/signUp/SignUp.jsx";
import AddCourse from "./components/addcourse/AddCourse.jsx";
import Logout from "./components/logout/logout.jsx";
import Courses from "./components/courses/Courses.jsx";
import GetCourse from "./components/getcourse/getCourse.jsx";
import Landing from "./components/landing/landing.jsx";
import UpdateCourse from "./components/UpdateCourse/updateCourse.js";
import UserCourse from "./userComponents/courses/courses.js";
import MyCourses from "./userComponents/myCourses/myCourses.js";
import ViewCourse from "./userComponents/view/viewUserCourse.js";
import { Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses/update/:Id" element={<UpdateCourse />} />
        <Route path="/courses/view/:Id" element={<GetCourse />} />

        <Route path="/user/courses" element={<UserCourse />} />
        <Route path="/mycourses" element={<MyCourses />} />
        <Route path="/user/courses/view/:Id" element={<ViewCourse />} />
      </Routes>
    </div>
  );
}

export default App;
