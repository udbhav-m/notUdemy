const jwt = require("jsonwebtoken");

const secretKeyForAdmins = "adminsSecretK3Y";
const secretKeyForUser = "usersSecretK3Y";

// Function to generate JWT token
function generateKeyForUser(idPass, secretKey) {
  const payload = { username: idPass.username };
  let token = jwt.sign(payload, secretKey);
  console.log(`token generated`);
  return token;
}

// Middleware for admin authentication
const adminAuthentication = (req, res, next) => {
  const token = req.headers.auth;
  if (token) {
    jwt.verify(token, secretKeyForAdmins, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      } else {
        req.user = user;
        console.log(`Token is valid. welcome ${user.username}`);
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};

// Middleware for user authentication
const userAuthentication = (req, res, next) => {
  const token = req.headers.auth;
  if (token) {
    jwt.verify(token, secretKeyForUser, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      } else {
        req.user = user;
        console.log(`Token is valid. welcome ${user.username}`);
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};

module.exports = {
  generateKeyForUser,
  userAuthentication,
  adminAuthentication,
  secretKeyForAdmins,
  secretKeyForUser,
};
