const express = require('express');
const morgan = require('morgan');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};
const db = require('./db');
const User = require('./models/user.model');
const superUser = require('./models/superuser.model');


const app = express();
// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', require('./routes/users'));
app.use('/superusers', require('./routes/superusers'));


// Server stater
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))