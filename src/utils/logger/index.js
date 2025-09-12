import pino from 'pino';
import { isBrowser } from '../index';

const LOG_TYPES = {
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn'
};

const formatMessages = messages => {
    return messages
        .map(msg => {
            if (msg instanceof Error) {
                return JSON.stringify(msg, Object.getOwnPropertyNames(msg));
            } else if (msg !== null && typeof msg === 'object') {
                return JSON.stringify(msg);
            }
            return msg;
        })
        .join('|');
};

const pinoLogger = pino({
    // base: { pid: process.pid },
    browser: {
        asObject: true
    },
    formatters: {
        level: label => ({ level: label })
    },
    timestamp: false
});

const generateLog = (method, transactionId, messages) => {
    if (typeof pinoLogger[method] === 'function') {
        const messageStr = formatMessages(messages);

        pinoLogger[method]({
            appCode: 'fed-static9-135',
            logTime: new Date().toISOString(),
            TRANSACTION_ID: transactionId,
            message: messageStr
        });
    }
};

const loggerWrapper = (transactionId = '') => {
    const baseLogger =
        method =>
        (...messages) => {
            const isClient = isBrowser();
            if (
                process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true' ||
                !isClient ||
                (isClient && method === LOG_TYPES.ERROR)
            ) {
                generateLog(method, transactionId, messages);
            }
        };

    return {
        log: baseLogger(LOG_TYPES.INFO),
        info: baseLogger(LOG_TYPES.INFO),
        warn: baseLogger(LOG_TYPES.WARN),
        error: baseLogger(LOG_TYPES.ERROR),
        time: baseLogger(LOG_TYPES.INFO),
        timeEnd: baseLogger(LOG_TYPES.INFO)
    };
};

export default loggerWrapper;
