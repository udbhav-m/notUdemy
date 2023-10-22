// import { useState } from 'react';
import { Typography, Button } from "@mui/material";
import "./appbar.css";
import { appBarState } from "../atoms/atoms";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AppBar() {
  const currentAppBar = useRecoilValue(appBarState);
  let returnAppBar;
  switch (currentAppBar) {
    case "LandingAppBar":
      returnAppBar = <LandingAppBar />;
      break;
    case "CourseHomeAppBar":
      returnAppBar = <CourseHomeAppBar />;
      break;
    case "AddCourseAppBar":
      returnAppBar = <AddCourseAppBar />;
      break;

    case "UpdateCourseAppBar":
      returnAppBar = <UpdateCourseAppBar />;
      break;
    case "UserCourseHomeAppBar":
      returnAppBar = <UserCourseHomeAppBar />;
      break;
    case "UserMyCourseAppBar":
      returnAppBar = <UserMyCourseAppBar />;
      break;
    case "UserViewAppBar":
      returnAppBar = <UserViewAppBar />;
      break;

    case null:
      returnAppBar = <>Error</>;
      break;

    default:
      returnAppBar = <>Error</>;
      break;
  }
  return (
    <>
      <div className="appBar">
        <Link className="link" to={!localStorage.getItem("token") ? "/" : ""}>
          <Typography variant="h5">
            <b>
              <i>not</i> Udemy
            </b>
          </Typography>
        </Link>
        {returnAppBar}
      </div>
    </>
  );
}

function LandingAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/login");
        }}
        variant="contained"
      >
        Sign In
      </Button>
      <Button
        onClick={() => {
          navigate("/signup");
        }}
        variant="contained"
      >
        Sign Up
      </Button>
    </div>
  );
}

function CourseHomeAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/addcourse");
        }}
        variant="contained"
      >
        Add Course
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function AddCourseAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UpdateCourseAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/addcourse");
        }}
        variant="contained"
      >
        Add Course
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserCourseHomeAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/mycourses");
        }}
        variant="contained"
      >
        My Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserMyCourseAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/user/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserViewAppBar() {
  const navigate = useNavigate();
  return (
    <div className="buttonContainer">
      <Button
        onClick={() => {
          navigate("/mycourses");
        }}
        variant="contained"
      >
        My Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/user/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          navigate("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}
export default AppBar;
