import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "../../components/appbar/appbar";
import {
  appBarState,
  coursesState,
  loadingState,
} from "../../components/atoms/atoms";
import axios from "axios";
import { baseURL } from "../../common";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./courses.css";

interface courseStructure {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  CourseId: number;
}

interface props extends courseStructure {
  purchaseFunction: (CourseId: number) => void;
}

function UserCourse() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UserCourseHomeAppBar");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useRecoilState(loadingState);
  const publishedCourses: courseStructure[] = useRecoilValue(coursesState);
  const setPublishedCourses = useSetRecoilState(coursesState);

  async function userCourses() {
    try {
      setLoading(true);
      const getAPI = await axios.get(`${baseURL}/user/courses`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });

      setPublishedCourses(getAPI.data);
      setLoading(false);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function purchaseCourse(CourseId: number) {
    try {
      setLoading(true);
      const purchaseAPI = await axios.post(
        `${baseURL}/user/courses/${CourseId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
        }
      );
      setLoading(false);
      window.alert(purchaseAPI.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    userCourses();
  }, []);

  return (
    <>
      <AppBar />
      <div className="userCourseCardContainer">
        {loading ? (
          <LinearProgress />
        ) : publishedCourses ? (
          publishedCourses.map((each) => {
            return (
              <UserCourseCard
                key={each.CourseId}
                title={each.title}
                description={each.description}
                imageLink={each.imageLink}
                CourseId={each.CourseId}
                price={each.price}
                purchaseFunction={purchaseCourse}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
}

function UserCourseCard(props: props) {
  const navigate = useNavigate();
  const loading = useRecoilValue(loadingState);
  return (
    <Card className="CourseCard" sx={{ width: 400 }}>
      <CardActionArea
        onClick={() => navigate(`/user/courses/view/${props.CourseId}`)}
      >
        <Typography style={{ padding: "1rem" }} variant="body2">
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
          <Typography
            className="userDescription"
            variant="body2"
            color="text.secondary"
          >
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={() =>
            loading ? (
              <LinearProgress />
            ) : (
              props.purchaseFunction(props.CourseId)
            )
          }
          size="small"
          color="primary"
        >
          <b>Purchase</b>
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserCourse;
