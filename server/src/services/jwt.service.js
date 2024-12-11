const jwt = require("jsonwebtoken");
function createToken(userData) {
  if (!userData?._id || !userData?.email) {
    throw new Error("Invalid user data");
  }
  const payload = {
    email: userData.email,
    _id: userData._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createToken, verifyToken };
