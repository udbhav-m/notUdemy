import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";

const secretKeyForAdmins = "adminsSecretK3Y";
const secretKeyForUser = "usersSecretK3Y";

type userInput = {
  username: string;
  password: string;
};

// Function to generate JWT token
function generateKeyForUser(idPass: userInput, secretKey: string) {
  const payload = { username: idPass.username };
  let token = jwt.sign(payload, secretKey);
  console.log(`token generated`);
  return token;
}

// Middleware for admin authentication
const adminAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.auth;
  if (token && typeof token ==='string') {
    jwt.verify(token, secretKeyForAdmins, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      }
      if(!user || user == undefined){
        console.log(`JWT verification failed`);
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({error :"failed. user is undefined"})
      }
      if (typeof user ==='string'){
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({error :"failed. userObj is string"})
      }
        req.headers["username"] = user.username;
        console.log(`Token is valid. welcome ${user.username}`);
        next();
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};

// Middleware for user authentication
const userAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.auth;
  if (token && typeof token ==='string') {
    jwt.verify(token, secretKeyForUser, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      }
      if(!user || user == undefined){
        console.log(`JWT verification failed`);
        res.status(401).json({ error: "JWT Authentication failed" });
        return {error :"failed. user is undefined"}
      }
      if (typeof user ==='string'){
        res.status(401).json({ error: "JWT Authentication failed" });
        return {error :"failed. user is undefined"}
      }
        req.headers["username"] = user.username;
        console.log(`Token is valid. welcome ${user.username}`);
        next();
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};

export {
  generateKeyForUser,
  userAuthentication,
  adminAuthentication,
  secretKeyForAdmins,
  secretKeyForUser,
};
