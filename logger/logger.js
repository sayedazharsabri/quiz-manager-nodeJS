const winston = require('winston');
const path = require('path');
const moment = require('moment');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
  defaultMeta: { service: 'quiz-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `errorYYYYMMDD.log`
    // - Write all logs with importance level of `info` or less to `combinedYYYYMMDD.log`
    //
    new winston.transports.File({ filename: path.join(__dirname,'..','log','error'+moment().format('YYYYMMDD')+'.log' ), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname,'..','log','combine'+moment().format('YYYYMMDD')+'.log' ) }),
  ],
});

//If we are in development only then it will transport data to console
if (process.env.NODE_ENV == 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;