/* eslint-disable react/prop-types */
import "./SignIn.css";
import AppBar from "../appbar/appbar";
import { Card, TextField, Button, Typography } from "@mui/material";
import { appBarState, passwordState, usernameState } from "../atoms/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface signInProps{
  funName: ()=> void
}

function SignIn() {
  const navigate = useNavigate()
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);

  async function signin() {
    try {
      const signInAPI = await axios.post(
        `http://localhost:3000/admin/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const res = signInAPI.data;
      console.log(res);
      localStorage.setItem("token",res.token)
      if (localStorage.getItem("token")){
        navigate("/courses")
      }
    } catch (error: any) {
      console.log(error.message);
      alert(error.message);
    }
  }
  return (
    <div>
      <AppBar />
      <div className="signInContainer">
        <SignInCard funName={signin}/>
      </div>
    </div>
  );
}

function SignInCard(props: signInProps) {
  const setUsername = useSetRecoilState(usernameState);
  const setPassword = useSetRecoilState(passwordState);
  return (
    <Card className="signInCard">
      <Typography variant="h6">
        <b>Welcome back!</b>
      </Typography>
      <TextField
        onChange={(e) => setUsername(e.target.value)}
        className="textfieldIn"
        variant="outlined"
        label="Username"
        type="text"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        className="textfieldIn"
        variant="outlined"
        label="Password"
        type="password"
      />
      <Button onClick={() => props.funName()} variant="contained">
        Sign In
      </Button>
    </Card>
  );
}

export default SignIn;
