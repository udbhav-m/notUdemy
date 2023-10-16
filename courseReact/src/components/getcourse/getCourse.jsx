/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRecoilState, useSetRecoilState } from "recoil";
import AppBar from "./../appbar/appbar";
import { appBarState, loadingState } from "../atoms/atoms";
import "./getCourse.css"
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress
  } from "@mui/material";
  import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

function GetCourse() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UpdateCourseAppBar");
  const [isLoading, setIsLoading] = useRecoilState(loadingState)
  const Id = useParams()
  const courseId = parseInt(Id.Id)
  const token = localStorage.getItem("token")
  const [course, setCourse] = useState({})

  useEffect(()=>{
    getCourse()
  },[courseId])
  async function getCourse(){
    setIsLoading(true)
    const getCAPI = await axios.get(`http://localhost:3000/admin/courses/${courseId}`,{
      headers:{
        "Content-Type" : "application/json",
        "auth": token
      }
    })
    const res = getCAPI.data
    setCourse(res)
    console.log(res)
    setIsLoading(false)
  }
  return (
    <>
      <AppBar />
      <div className="getCourseContainer">
        {(isLoading)?
        <CircularProgress/>:
        <GetCourseCard description = {course.description} title = {course.title}
        CourseId = {course.CourseId} published = {course.published} price = {course.price}
        imageLink ={course.imageLink} />}
      </div>
    </>
  );
}

function GetCourseCard(props) {
  return (
    <Card className="getCard">
        <Typography variant="body2" color="text.secondary">
          <i>
            <b>{props.published}</b>
          </i>
        </Typography>
        <Typography variant="body2">
          <i>
            <b>{props.price}</b>
          </i>
        </Typography>
      <CardMedia
        component="img"
        height="250"
        image ={props.imageLink}
        alt="courseImage"
      />
      <CardContent className="cContent">
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

export default GetCourse;
