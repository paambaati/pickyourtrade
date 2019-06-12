import Koa from 'koa';
import Router from 'koa-tree-router';
import supertest from 'supertest';
import test from 'tape';
import {
    errorHandlingMiddleware,
    responseTimeMiddleware,
    basicAuthMiddleware,
} from '../../src/utils/middleware';

/**
 * Common variables.
 */

const consoleError = console.error;

/**
 * Helper functions.
 */

function disableErrorConsole() {
    console.error = () => { };
}

function enableErrorConsole() {
    console.error = consoleError;
}

/**
 * Tests.
 */

test("✨ UTILS/middleware — Response time middleware should attach a 'X-Response-Time' header to all responses.", t => {
    t.plan(3);
    // Set up Koa route mock.
    const app = new Koa();
    const router = new Router();
    app.use(responseTimeMiddleware);
    router.get('/', async (ctx, next) => {
        ctx.body = 'OK';
        return await next();
    });
    app.use(router.routes());
    const server = app.listen();
    supertest(server)
        .get('/')
        .expect(200)
        .end((err, res) => {
            t.equals(err, null, 'Should not return any errors.');
            t.true(res.header.hasOwnProperty('x-response-time'), "Should contain the 'X-Response-Time' header.");
            t.ok(new RegExp(/^\d*.\d*(ms)$/).test(res.header['x-response-time']), "'X-Response-Time' header should be the response time in the (XX.XX..)ms format.");
            server.close();
            t.end();
        });
});

test('✨ UTILS/middleware — Basic authentication middleware return a 401 on protected route when no auth header is given.', t => {
    t.plan(2);
    const endpoint = '/dummy';
    const mockResponse = { dummy: true };
    disableErrorConsole();
    // Set up Koa route mock.
    const app = new Koa();
    const router = new Router();
    app.use(errorHandlingMiddleware);
    router.get(endpoint, basicAuthMiddleware, async (ctx, next) => {
        ctx.body = mockResponse;
        return await next();
    });
    app.use(router.routes());
    const server = app.listen();
    supertest(server)
        .get(endpoint)
        .expect(401)
        .end((err, res) => {
            enableErrorConsole();
            t.equals(err, null, 'Should not return any errors.');
            t.deepEquals(res.body, { err: true, code: 'ERR_UNAUTHORIZED', msg: 'Unauthorized! You need a token to use this API!' }, 'Should return the expected response.');
            server.close();
            t.end();
        });
});

test('✨ UTILS/middleware — Error handling middleware should return a nicely formatted response for all unexpected errors.', t => {
    t.plan(2);
    const errMessage = 'oops';
    const errCode = 'ERR_SOME_CODE';
    disableErrorConsole();
    // Set up Koa route mock.
    const app = new Koa();
    const router = new Router();
    app.use(errorHandlingMiddleware);
    router.get('/', async (ctx, next) => {
        const err = new Error(errMessage);
        err['code'] = errCode;
        throw err;
    });
    app.use(router.routes());
    const server = app.listen();
    supertest(server)
        .get('/')
        .expect(500)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            enableErrorConsole();
            t.equals(err, null, 'Should still return a response.');
            t.deepEquals(res.body, { err: true, code: errCode, msg: errMessage }, 'Response should include error message & code.');
            server.close();
            t.end();
        });
});
