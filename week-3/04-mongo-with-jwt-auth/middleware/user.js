const { decodeJwt, verifyJwt } = require("../security/jwtUtil");

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization;
  if (verifyJwt(token)) {
    req.username = decodeJwt(token).username;
    next();
  } else {
    res.json({ message: "Invalid JWT token" });
  }
}

module.exports = userMiddleware;
