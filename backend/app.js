const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working 🎉');
});

// ТУТ додаватимеш маршрути
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;
