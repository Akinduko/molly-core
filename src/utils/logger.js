import winston from 'winston';
const winstonRotator = require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  filename: './logs/Adenison-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', function(oldFilename, newFilename) {
  console.log('rotating files')
});


const logger = winston.createLogger({
  transports: [transport]
});
 

module.exports = {
  'logger': logger,
};