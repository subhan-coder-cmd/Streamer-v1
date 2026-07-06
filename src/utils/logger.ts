import winston from 'winston';

// Custom log format
const logFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.colorize(),
	winston.format.printf((info) => {
		const splatArgs = (info as any)[Symbol.for('splat')] || [];
		const extra = splatArgs.length ? ' ' + splatArgs.map((a: any) => (a instanceof Error ? a.stack || a.message : (typeof a === 'object' ? JSON.stringify(a) : String(a)))).join(' ') : '';
		return `[${info.timestamp}] ${info.level}: ${info.message}${extra}`;
	})
);

// Create logger instance
const logger = winston.createLogger({
	level: 'info',
	format: logFormat,
	transports: [
		// Console output
		new winston.transports.Console(),
		// File output for dashboard
		new winston.transports.File({ 
			filename: 'bot.log',
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.printf((info) => {
					const splatArgs = (info as any)[Symbol.for('splat')] || [];
					const extra = splatArgs.length ? ' ' + splatArgs.map((a: any) => (a instanceof Error ? a.stack || a.message : (typeof a === 'object' ? JSON.stringify(a) : String(a)))).join(' ') : '';
					return `[${info.timestamp}] ${info.level}: ${info.message}${extra}`;
				})
			)
		})
	]
});

export default logger;
