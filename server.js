require('dotenv').config();
const express = require('express'); 
const app = express();
const { logger,logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
//const cors = require('cors');
const PORT = process.env.PORT || 3500;
const path = require('path');
const { connect } = require('http2');

connectDB()

console.log(process.env.NODE_ENV); // logs the environment

app.use(logger); // logs the request method and path to the console

app.use(express.json()); // parses incoming requests with JSON payloads

app.use(express.static(path.join(__dirname, 'public'))); // for static files - css

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/artists', require('./routes/artistRoute'));
//app.use('/arts', require('./routes/artRoute'));

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({error: 'Not found'});
    } else {
        res.type('txt').send('404 Not found');
    }
});

app.use(errorHandler); // handles errors

mongoose.connection.once('open', () => {
    console.log('Mongoose is connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})


mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log') // logs the error
});
