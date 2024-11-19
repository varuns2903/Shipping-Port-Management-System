const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const UserController = {
  register: async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const checkUserQuery = "SELECT * FROM Users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(
        query,
        [username, email, hashedPassword, role],
        (err, result) => {
          if (err) throw err;
          res.status(201).json({ id: result.insertId, username, email, role });
        }
      );
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM Users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ msg: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  },

  getProfile: async (req, res) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      db.query(
        "SELECT * FROM Users WHERE user_id = ?",
        [decoded.id],
        (err, results) => {
          if (err) {
            console.error("Error fetching user details:", err);
            return res.status(500).json({
              message: "Error fetching user details",
              error: err.message,
            });
          }
          res.json({ data: results[0] });
        }
      );
    } catch (e) {
      res.status(400).json({ msg: "Invalid token" });
    }
  },

  updateProfile: async (req, res) => {
    const token = req.header("Authorization");
    const { username, email } = req.body;

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      db.query(
        "UPDATE  Users SET username = ?, email = ? WHERE user_id = ?",
        [username, email, decoded.id],
        (err, results) => {
          if (err) {
            console.error("Error updating user details:", err);
            return res.status(500).json({
              message: "Error updating user details",
              error: err.message,
            });
          }
          res.json({ data: results[0] });
        }
      );
    } catch (e) {
      res.status(400).json({ msg: "Invalid token" });
    }
  },
};

module.exports = UserController;
