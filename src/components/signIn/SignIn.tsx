/* eslint-disable react/prop-types */
import "./SignIn.css";
import AppBar from "../appbar/appbar";
import {
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  appBarState,
  passwordState,
  usernameState,
  userLoginState,
  adminLoginState,
} from "../atoms/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../common";

interface signInProps {
  funName: () => void;
}

function SignIn() {
  const navigate = useNavigate();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);
  const userLogin = useRecoilValue(userLoginState);
  const adminLogin = useRecoilValue(adminLoginState);

  async function signin() {
    try {
      let URL: string = "";
      userLogin
        ? (URL = `${baseURL}/user/login`)
        : adminLogin
        ? (URL = `${baseURL}/admin/login`)
        : "";
      const signInAPI = await axios.post(
        URL,
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
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      if (localStorage.getItem("token") && adminLogin) {
        navigate("/courses");
      } else {
        navigate("/user/courses");
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
        <SignInCard funName={signin} />
      </div>
    </div>
  );
}

function SignInCard(props: signInProps) {
  const setUsername = useSetRecoilState(usernameState);
  const setPassword = useSetRecoilState(passwordState);
  const setUser = useSetRecoilState(userLoginState);
  const setAdmin = useSetRecoilState(adminLoginState);
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

      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value="user"
            control={
              <Radio
                onChange={() => {
                  setUser(true);
                  setAdmin(false);
                }}
              />
            }
            label="User "
          />
          <FormControlLabel
            value="admin"
            control={
              <Radio
                onChange={() => {
                  setAdmin(true);
                  setUser(false);
                }}
              />
            }
            label="Admin"
          />
        </RadioGroup>
      </FormControl>
      <Button onClick={() => props.funName()} variant="contained">
        Sign In
      </Button>
    </Card>
  );
}

export default SignIn;
