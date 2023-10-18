/* eslint-disable react/prop-types */
import { useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "../appbar/appbar";
import { appBarState, passwordState, usernameState } from "../atoms/atoms";
import { Card, Typography, TextField, Button } from "@mui/material";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface propType{
  handleFunction: ()=> void
}

function SignUp() {
  const navigate = useNavigate();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);

  async function signUp() {
    try {
      const signUpAPI = await axios.post(
        `http://localhost:3000/admin/signup`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = signUpAPI.data;
      console.log(res);
      alert(Object.values(res)[0]);
      if (res.done) {
        navigate("/login");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <AppBar></AppBar>
      <div className="signUpContainer">
        <SignUpCard handleFunction={signUp} />
      </div>
    </div>
  );
}

function SignUpCard(props: propType) {
  const setUsername = useSetRecoilState(usernameState);
  const setPassword = useSetRecoilState(passwordState);
  return (
    <Card className="signUpCard">
      <Typography variant="h6">
        <b>Create an account!</b>
      </Typography>
      <TextField
        onChange={(e) => setUsername(e.target.value)}
        className="textfieldUp"
        variant="outlined"
        label="Username"
        type="text"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        className="textfieldUp"
        variant="outlined"
        label="Password"
        type="password"
      />
      <Button
        onClick={() => {
          props.handleFunction();
        }}
        variant="contained"
      >
        Sign Up
      </Button>
    </Card>
  );
}

export default SignUp;
