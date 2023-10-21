/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appBarState, coursesState, loadingState } from "../atoms/atoms";
import AppBar from "../appbar/appbar";
import "./Courses.css";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

interface courseStructure{
  title: string
  description: string
  price: number
  imageLink: string
  published: boolean
  CourseId: number
}

interface props extends courseStructure{
  delFunction: (id: number) => void
}

function Courses() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("CourseHomeAppBar");
  const token = localStorage.getItem("token");
  const courseList: courseStructure[] = useRecoilValue(coursesState)
  const setCourses = useSetRecoilState(coursesState)
  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  useEffect(()=>{
    getCourses()
  },[])

  async function getCourses() {
    setIsLoading(true);
    try {
      const getAPi = await axios.get(`http://localhost:3000/admin/courses`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });
      const res = getAPi.data;
      setCourses(res);
      console.log("loading")
      setIsLoading(false)
    } catch (error: any) {
      console.log(error.message)
    }
  }
  async function deleteById(Id: number){
    try{
      console.log(Id)
    const delAPI =await axios.delete(`http://localhost:3000/admin/courses/${Id}`,{
      headers:{
        "Content-type":"application/json",
        "auth": token
      }
    })
    console.log(delAPI.data)
    getCourses()
    }
    catch(err: any){
      console.log(err.message)
    }

  }
  
  return (
    <>
      <AppBar />
      <div className="courseCardContainer">
        {(isLoading)?
        <CircularProgress disableShrink />:
        courseList.map((each)=>{
          return(
            <CourseCard key= {each.CourseId} title={each.title}
            description={each.description} imageLink={each.imageLink}
            published={each.published} 
            CourseId={each.CourseId} price ={each.price}
            delFunction={deleteById}
            />
          )
        })}
      </div>
    </>
  );
}

export function CourseCard(props: props) {
  const navigate = useNavigate();
  return (
    <Card className="CourseCard" sx={{ width: 400 }}>
      <CardActionArea onClick={() => navigate(`/courses/view/${props.CourseId}`)}>
      <Typography style={{padding:"1rem"}} variant="body2">
          <i>
            <b>${props.price}</b>
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
          <Typography className="description" variant="body2" color="text.secondary">
            {props.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <i>
              <b>{props.published}</b>
            </i>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={() => navigate(`/courses/update/${props.CourseId}`)}
          size="small"
          color="primary"
        >
          <b>Edit</b>
        </Button>
        <Button onClick={()=> props.delFunction(props.CourseId)} size="small" color="error">
          <b>Delete</b>
        </Button>
      </CardActions>
    </Card>
  );
}

export default Courses;
