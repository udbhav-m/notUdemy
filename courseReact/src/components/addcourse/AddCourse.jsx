/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useRecoilValue, useSetRecoilState } from "recoil";
import "./AddCourse.css";
import { appBarState, addCourseState } from "../atoms/atoms";
import AppBar from "./../appbar/appbar";
import {
  Card,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

function AddCourse() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("AddCourseAppBar");
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);
  const token = localStorage.getItem("token");

  async function addCourse() {
    const addAPI = await axios.post(
      "http://localhost:3000/admin/courses",
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
  }

  return (
    <div>
      <AppBar />
      <div className="addCourseContainer">
        <AddCourseCard published={published} funName={addCourse} />
      </div>
    </div>
  );
}

function AddCourseCard(props) {
  const setAddCourseData = useSetRecoilState(addCourseState);
  return (
    <Card className="addCoursecard">
      <Typography variant="h6">
        <b>ADD A COURSE</b>
      </Typography>
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            title: e.target.value,
          }))
        }
        className="textfieldAdd"
        variant="outlined"
        label="Title"
        type="text"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            description: e.target.value,
          }))
        }
        className="textfieldAdd"
        variant="outlined"
        label="Description"
        type="text"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            price: e.target.value,
          }))
        }
        className="textfieldAdd"
        variant="outlined"
        label="Price"
        type="number"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            imageLink: e.target.value,
          }))
        }
        className="textfieldAdd"
        variant="outlined"
        label="Image Link"
        type="text"
      />

      <FormControlLabel
        label="Publish"
        control={
          <Checkbox
            checked={props.published}
            onChange={(e) =>
              setAddCourseData((prevdata) => ({
                ...prevdata,
                published: e.target.checked,
              }))
            }
          />
        }
      />
      <Button
        onClick={() => {
          props.funName();
        }}
        variant="contained"
      >
        Add course
      </Button>
    </Card>
  );
}
export default AddCourse;
