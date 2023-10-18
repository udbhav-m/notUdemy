import AppBar from "../appbar/appbar";
import "./landing.css";
import { useSetRecoilState } from "recoil";
import { appBarState } from "../atoms/atoms";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const navigate = useNavigate();
  return (
    <div>
      <AppBar></AppBar>
      <div className="centerData">
        <div className="leftData">
          <Typography style={{ marginTop: "5rem" }} variant="h4">
            <b>
              This is not Udemy <i>ofcourse</i>.
            </b>
          </Typography>

          {/* buttonContainer class adds styles from appBar.css */}
          <div className="buttonContainer buttons">
            <Button
              onClick={() => {
                navigate("/login");
              }}
              variant="contained"
            >
              Sign In
            </Button>
            <Button onClick={() => {
                navigate("/signup");
              }} variant="contained">Sign Up</Button>
          </div>
        </div>
        <div className="image">
          <Typography style={{ marginTop: "5rem" }} variant="h2">
            <b>
              <i>not</i>
            </b>
          </Typography>
          <img
            src="https://logowik.com/content/uploads/images/udemy-new-20212512.jpg"
            alt="logo"
            width="300"
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
