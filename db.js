const mongoose = require('mongoose');

let mongoDB;
if (process.env.NODE_ENV !== 'production') {
    mongoDB = 'mongodb://localhost:27017/borrowjeje'
} else {
    mongoDB = process.env.DB_URL
};
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connected sucessfully');
});

module.exports = db