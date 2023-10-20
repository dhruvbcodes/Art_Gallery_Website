const { format } = require('date-fns')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')
const fsPromises = require('fs').promises

const logEvents = async (message, fileName) => {

    const log = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\t${uuidv4()}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname, '../logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '../logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, `../logs/${fileName}`), log), { encoding: 'utf-8'}
    } catch(err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'accessLog.log')
    console.log(`${req.method}\t${req.path}`)    
    next()
}

module.exports = { logger, logEvents }