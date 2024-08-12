const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    console.error("No token provided");
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Failed to authenticate token:", err);
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
