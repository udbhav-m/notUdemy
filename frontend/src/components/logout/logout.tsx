import { useSetRecoilState } from "recoil";
import { appBarState } from "../atoms/atoms";
import AppBar from "../appbar/appbar";
import { LinearProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  localStorage.removeItem("token");
  useEffect(()=>{
      setTimeout(()=>navigate("/") ,1500)
  })
  return (
    <>
      <AppBar />
      <LinearProgress />
      <div>
        <center>
          <Typography style={{marginTop:"10rem"}} variant="h5"><b>Redirecting...</b></Typography>
        </center>
      </div>
    </>
  );
}

export default Logout;
