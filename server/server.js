const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const ports = require('./routes/ports');
const bookings = require('./routes/bookings');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/ports', ports);
app.use('/api/bookings', bookings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
