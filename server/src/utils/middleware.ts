/**
 * Simple Koa Middleware.
 */

import config from 'config';
import { IRouterContext } from 'koa-tree-router';
import Logger from './logging';

// Initializers.
const logger = new Logger('pyt-middleware').logger;

/**
 * User credentials interface.
 *
 * @interface IUser
 * @extends {Object}
 */
export interface IUser extends Object {
    username: string;
    password: string;
}

/**
 * Basic authentication middleware.
 * Checks if credentials exist in config.users and returns a 401 if they don't.
 * @param ctx Koa context.
 * @param next Koa next.
 */
export async function basicAuthMiddleware(ctx: IRouterContext, next: () => Promise<any>) {
    const authHeader = ctx.get('Authorization');
    const token = authHeader.replace('Basic ', '');
    const decodedToken = Buffer.from(token, 'base64').toString('ascii');
    const [username, password] = decodedToken.split(':');
    const matches = (config.get('users') as IUser[]).filter(user => {
        if (user.username === username && user.password === password) {
            return user;
        }
    });
    if (matches.length !== 1) {
        const error = new Error('Unauthorized! You need a token to use this API!');
        error['code'] = 'ERR_UNAUTHORIZED';
        error['statusCode'] = 401;
        throw error;
    }
    await next();
}

/**
 * Request logging middleware.
 * Simply logs all incoming requests.
 * @param ctx Koa context.
 * @param next Koa next.
 */
export async function requestLoggingMiddleware(ctx: IRouterContext, next: () => Promise<any>) {
    const request = ctx.toJSON().request;
    let url = request.url;
    /* istanbul ignore else */
    if (url.includes('password')) {
        url = `${url.split('password=')[0]}password=***`;
    }
    logger.debug({
        msg: 'New API Request',
        method: request.method,
        url,
    });
    await next();
}

/**
 * Response time middleware.
 * Attaches a `X-Response-Time` header with the time taken in milliseonds.
 * @param ctx Koa context.
 * @param next Koa next.
 */
export async function responseTimeMiddleware(ctx: IRouterContext, next: () => Promise<any>) {
    const start: [number, number] = process.hrtime();
    await next();
    const end: [number, number] = process.hrtime(start);
    const ms: number = (end[0] * 1e9 + end[1]) / 1e6;
    ctx.set('X-Response-Time', `${ms}ms`);
}

/**
 * Error handling middleware.
 * @param ctx Koa context.
 * @param next Koa next.
 */
export async function errorHandlingMiddleware(ctx: IRouterContext, next: () => Promise<any>) {
    try {
        await next();
    } catch (err) {
        ctx.body = {
            err: true,
            code: err['code'],
        };
        ctx.status = err['statusCode'] || 500;
        ctx.body.msg = err.message;
        logger.error({
            msg: 'Something went terribly wrong on the API server!',
            err,
            context: ctx,
        });
        ctx.app.emit('error', err, ctx);
    }
}
