var jwt = require("jsonwebtoken");
const jwtPassword = "secret-key";

function signJwt(obj) {
  return jwt.sign(obj, jwtPassword);
}

function verifyJwt(token) {
  token = token.slice(7);
  try {
    jwt.verify(token, jwtPassword);
    return true;
  } catch (err) {
    return false;
  }
}

function decodeJwt(token) {
  token = token.slice(7);
  return jwt.decode(token);
}

module.exports = {
  signJwt,
  verifyJwt,
  decodeJwt,
};
