const winston = require('winston');
const { combine, timestamp, colorize, printf, errors, prettyPrint } = winston.format;

const consoleFormat = printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}` + (info.stack === undefined ? "" : `\n${info.stack}`));
const logLevels = {
    levels: {
        fatal: 0, // Statements representing the most severe of error conditions, assumedly resulting in program termination.
        error: 1, // Statements that describe non-fatal errors in the application; quite often for loggin handled exceptions.
        warn: 2,  // Statements that describe potentially harmful events or states in the program.
        info: 3,  // Statements concerning program state, representing program events or behavior tracking.
        debug: 4, // Fine-grained statements concerning program state, typically used for debugging.
        trace: 5, // Statements that provide context to understand the steps leading up to errors and warnings
    },
    colors: {
        fatal: 'bold redBG',
        error: 'bold yellowBG',
        warn: 'blueBG',
        info: 'green',
        debug: 'yellow',
        trace: 'blue'
    }
};

winston.addColors(logLevels.colors);

const logger = winston.createLogger({
    levels: logLevels.levels,
    level: process.env.LOG_LEVEL || 'trace',
    format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }), errors({ stack: true }), prettyPrint()),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
                consoleFormat,
            )
        }),
        new winston.transports.File({
            filename: "messages.log",
            level: 'warn',
        }),
    ],
});

module.exports = { logger }