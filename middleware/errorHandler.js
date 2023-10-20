const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log') // logs the error 

    console.log(err.stack) // logs the stack trace

    const status = res.statusCode === 200 ? 500 : res.statusCode // if the status code is 200, set it to 500, otherwise use the status code

    res.status(status).json({ error: err.message }) // sends the error message to the client
}

module.exports = errorHandler