import options from 'koa-session-minimal';
const log4js = require('log4js');

module.exports = (options) => {
    return async (ctx, next) => {
        const start = new Date.now();
        log4js.configure({
            appenders: {
                cheese: {
                    type: 'file',
                    filename: 'cheese.log'
                }
            },
            categories: {
                default: {
                    appenders: ['cheese'],
                    level: 'error'
                }
            }
        });

        const logger = log4js.getLogger('cheese');

        await next();
        const end = new Date.now();
        const responseTime = end - start;
        logger.info(`响应时间为${responseTime/1000}s`);
    }

};