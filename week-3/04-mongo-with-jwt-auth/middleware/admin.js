const { verifyJwt, decodeJwt } = require("../security/jwtUtil");
// Middleware for handling auth
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization;
  if (verifyJwt(token)) {
    next();
  } else {
    res.json({ message: "Invalid JWT token" });
  }
}

module.exports = adminMiddleware;
