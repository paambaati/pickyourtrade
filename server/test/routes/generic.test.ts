import config from 'config';
import Koa from 'koa';
import Router from 'koa-tree-router';
import supertest from 'supertest';
import test from 'tape';
import { pingRoute } from '../../src/routes/generic';

/**
 * Tests.
 */

test('✨ ROUTES/generic — API server should respond to ping endpoint (/) with pong response.', t => {
    t.plan(2);
    const endpoint = '/';
    const app = new Koa();
    const router = new Router();
    router.get(endpoint, pingRoute);
    app.use(router.routes());
    const server = app.listen();
    supertest(server)
        .get(endpoint)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
            t.equals(err, null, 'Should not return any errors.');
            t.deepEquals(res.body, {
                err: false,
                pong: true,
            }, 'Should respond with a pong response.');
            server.close();
            t.end();
        });
});
