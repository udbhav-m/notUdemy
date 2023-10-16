/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import SignIn from "./components/signIn/SignIn";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./components/signUp/SignUp";
import AddCourse from "./components/addcourse/AddCourse";
import Logout from "./components/logout/logout.jsx";
import Courses from "./components/courses/Courses";
import UpdateCourse from "./components/updateCourse/updateCourse";
import GetCourse from "./components/getcourse/getCourse";
import Landing from "./components/landing/landing";

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
      </Routes>
    </div>
  );
}

export default App;
