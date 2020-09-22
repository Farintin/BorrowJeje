const mongoose = require('mongoose');

const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connected sucessfully');
});

module.exports = db