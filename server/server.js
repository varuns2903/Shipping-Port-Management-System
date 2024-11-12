const express = require("express");
const cors = require("cors");
const users = require("./routes/users");
const adminDashboard = require("./routes/adminDashboard");
const ports = require("./routes/ports")
const bookings = require("./routes/bookings")
const ships = require("./routes/ships")
const { auth, isAdmin } = require("./middleware/auth");

require("dotenv").config();

const app = express();
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", users);
app.use("/api/admin", auth, isAdmin, adminDashboard);
app.use("/api/ports", auth, ports);
app.use("/api/bookings", auth, bookings);
app.use("/api/shipments", auth, ships);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
