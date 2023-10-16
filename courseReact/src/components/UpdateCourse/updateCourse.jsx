/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { appBarState, loadingState, addCourseState } from "../atoms/atoms";
import AppBar from "../appbar/appbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import "./updateCourse.css";
import axios from "axios";

function UpdateCourse() {
  const navigate = useNavigate();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UpdateCourseAppBar");
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const Id = useParams();
  const courseId = parseInt(Id.Id);
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState({});
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);

  useEffect(() => {
    getCourse();
  }, []);
  async function getCourse() {
    setIsLoading(true);
    const getCAPI = await axios.get(
      `http://localhost:3000/admin/courses/${courseId}`,
      {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      }
    );
    const res = getCAPI.data;
    setCourse(res);
    console.log(res);
    setIsLoading(false);
  }

  async function updateCourse() {
    const addAPI = await axios.put(
      `http://localhost:3000/admin/courses/${courseId}`,
      {
        title,
        description,
        price,
        imageLink,
        published,
      },
      {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      }
    );
    const data = addAPI.data;
    console.log(data);
    alert(Object.values(data)[0]);
    getCourse();
  }
  return !token ? (
    navigate("/login")
  ) : (
    <>
      <AppBar />
      <div className="updateCourseContainer">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <UpdateCard
            description={course.description}
            title={course.title}
            CourseId={course.CourseId}
            published={course.published}
            price={course.price}
            imageLink={course.imageLink}
          />
        )}
        <UpdateFields funName={updateCourse} CourseId={courseId} />
      </div>
    </>
  );
}

function UpdateCard(props) {
  return (
    <Card className="updateCard">
      <Typography className="typoPub" variant="body2" color="text.secondary">
        <i>
          <b>
            {props.published === true ? <>Published</> : <>Not published</>}
          </b>
        </i>
      </Typography>
      <Typography className="typoPub" variant="body2">
        <i>
          <b>{props.price}</b>
        </i>
      </Typography>
      <CardMedia
        component="img"
        height="250"
        image={props.imageLink}
        alt="courseImage"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.CourseId}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function UpdateFields(props) {
  const setUpdateCourseData = useSetRecoilState(addCourseState);
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);
  return (
    <Card className="updateFieldCard">
      <Typography variant="h6">
        <b>UPDATE COURSE</b>
      </Typography>
      <TextField
        value={title}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            title: e.target.value,
          }))
        }
        className="textfieldUpdate"
        variant="outlined"
        label="Title"
        type="text"
      />
      <TextField
        multiline
        value={description}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            description: e.target.value,
          }))
        }
        className="textfieldUpdate"
        variant="outlined"
        label="Description"
        type="text"
      />
      <TextField
        value={price}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            price: e.target.value,
          }))
        }
        className="textfieldUpdate"
        variant="outlined"
        label="Price"
        type="number"
      />
      <TextField
        value={imageLink}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            imageLink: e.target.value || prevdata.imageLink,
          }))
        }
        className="textfieldUpdate"
        variant="outlined"
        label="Image Link"
        type="text"
      />

      <FormControlLabel
        label="Publish"
        control={
          <Checkbox
            checked={published}
            onChange={(e) =>
              setUpdateCourseData((prevdata) => ({
                ...prevdata,
                published: e.target.checked,
              }))
            }
          />
        }
      />
      <Button
        onClick={() => {
          props.funName(props.CourseId);
        }}
        variant="contained"
      >
        Update
      </Button>
    </Card>
  );
}

export default UpdateCourse;
