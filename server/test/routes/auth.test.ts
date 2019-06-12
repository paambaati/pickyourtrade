import config from 'config';
import Koa from 'koa';
import Router from 'koa-tree-router';
import nock from 'nock';
import supertest from 'supertest';
import test from 'tape';
import { authRoute } from '../../src/routes/auth';

/**
 * Tests.
 */

test('✨ ROUTES/auth — API server should respond to token endpoint (/token/<username>) with a authorization token.', t => {
    const username = 'test1';
    const password = 'pass1';
    const backend = 'https://pickyourtrade.com';
    const endpoint = `/token/${username}?password=${password}`;
    // Set up crawl URL request mock.
    const responseStatusCode = 200;
    const responseMessage = { token: 'dGVzdDE6cGFzczE=', user: 'test1' };
    const mock = nock(backend)
        .get(endpoint)
        .reply(responseStatusCode, responseMessage);
    // Set up Koa route mock.
    const app = new Koa();
    const router = new Router();
    router.get('/token/:username', authRoute);
    app.use(router.routes());
    const server = app.listen();
    supertest(server)
        .get(`${endpoint}`)
        .expect('Content-Type', /application\/json/)
        .expect(responseStatusCode)
        .end((err, res) => {
            t.deepEquals(err, null, 'Should not return/throw any errors.');
            t.deepEquals(res.body, { username: 'test1', token: 'dGVzdDE6cGFzczE=' });
            nock.cleanAll();
            server.close();
            t.end();
        });
});
