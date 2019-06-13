/**
 * PickYourTrade Server.
 */

import config from 'config';
import { Server } from 'http';
import Koa from 'koa';
import Router from 'koa-tree-router';
import BodyParser from 'koa-json-body';
import CORS from '@koa/cors';
import { authRoute } from './routes/auth';
import {
    portfolioSelectRoute,
    portfolioInsertRoute,
    portfolioUpdateRoute,
} from './routes/portfolio';
import { pingRoute } from './routes/generic';
import Logger from './utils/logging';
import {
    requestLoggingMiddleware,
    responseTimeMiddleware,
    errorHandlingMiddleware,
    basicAuthMiddleware,
} from './utils/middleware';
import Database from './utils/database';

// Initializers.
const logger = new Logger('pyt-server').logger;
new Database(config.get('database.file'), config.get('database.memory'), config.get('database.migrations'));

// Koa setup.
const app = new Koa();
const router = new Router({
    // 405 handler.
    onMethodNotAllowed(ctx) {
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = {
            err: true,
            message: 'Method Not Allowed',
        };
    },
});

/**
 * Middleware.
 */
app.use(errorHandlingMiddleware);
app.use(CORS());
app.use(BodyParser());
app.use(responseTimeMiddleware);
app.use(requestLoggingMiddleware);

/**
 * API Routes.
 */

// Generic routes.
router.get('/', pingRoute);

// Authentication routes.
router.get('/token/:username', authRoute);

// Database routes.
router.get('/portfolio/:username', basicAuthMiddleware, portfolioSelectRoute);
router.put('/portfolio/:username', basicAuthMiddleware, portfolioInsertRoute);
router.patch('/portfolio/:username', basicAuthMiddleware, portfolioUpdateRoute);

// Attach routes as middleware.
app.use(router.routes());

// Log unhandled promise rejections.
/* istanbul ignore next */
process.on('unhandledRejection', (err, promise) => {
    logger.warn({
        msg: 'Unhandled promise rejection detected! Fix this soon as future Node.js versions would throw this as a non-zero exit error!',
        err,
        promise,
    });
});

/**
 * Server spin-up.
 */

// Start server.
/* istanbul ignore next */
const port = config.get('api.port') || 4200;
const server: Server = app.listen(port);
server.setTimeout(300000); // See https://github.com/koajs/koa/issues/766
logger.info({
    msg: 'PickYourTrade API Server now listening...',
    port,
});

/**
 * Exports.
 */

export {
    router,
    server,
};
