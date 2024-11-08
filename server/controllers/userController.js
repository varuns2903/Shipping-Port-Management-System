const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const UserController = {
  register: async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, hashedPassword, role], (err, result) => {
      if (err) throw err;
      res.status(201).json({ id: result.insertId, username, email, role });
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
};

module.exports = UserController;
