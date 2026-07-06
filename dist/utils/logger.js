import winston from 'winston';
const logFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.colorize(), winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
}));
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'bot.log',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] ${level}: ${message}`;
            }))
        })
    ]
});
export default logger;
//# sourceMappingURL=logger.js.map