const jwt = require("jsonwebtoken");
const db = require("../config/db");

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

async function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized access" });
  }

  try {
    const query = "SELECT role FROM Users WHERE user_id=?";
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error("Error fetching user role:", err);
        return res
          .status(500)
          .json({ message: "Error fetching user role", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = results[0];
      if (user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    });
  } catch (error) {
    res.status(400).json({ msg: "Unauthorized access" });
  }
}

module.exports = { auth, isAdmin };
