const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
