// const jwt = require("express-jwt");
const jwt = require("jsonwebtoken");

// Instantiate the JWT token validation middleware
// const isAuthenticated = jwt({
//   secret: process.env.TOKEN_SECRET,
//   algorithms: ["HS256"],
//   requestProperty: "payload",
//   getToken: getTokenFromHeaders,
// });

// // Function used to extracts the JWT token from the request's 'Authorization' Headers
// function getTokenFromHeaders(req) {
//   // Check if the token is available on the request Headers
//   console.log("headers auth",req.headers.authorization)
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.split(" ")[0] === "Bearer"
//   ) {
//     // Get the encoded token string and return it
//     const token = req.headers.authorization.split(" ")[1];
//     return token;
//   } else {
//     return null;
//   }

// }
const isAuthenticated = async (req, res, next) => {
  // const token = req.header("Authorization");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token not found" });
  try {
    const info = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(info);
    req.user = info.user;
    next();
  } catch (error) {
    return res.json(error.message);
  }
};


// Export the middleware so that we can use it to create a protected routes
module.exports = {
  isAuthenticated,
};