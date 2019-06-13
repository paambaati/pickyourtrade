import supertest from 'supertest';
import test from 'tape';
import { server, router } from '../src/server';

// Initializers.
server.close(); // First close the server because it is listening as soon as import happens.
const consoleError = console.error;

/**
 * Helper functions.
 */

function disableErrorConsole() {
    console.error = () => {};
}

function enableErrorConsole() {
    console.error = consoleError;
}

/**
 * Tests.
 */

test('✨ SERVER — server should return a 405 error when we try to use an unhandled HTTP method.', t => {
    t.plan(2);
    const endpoint = '/';
    const freshServer = server.listen();
    supertest(server)
        .post(endpoint) // Use a POST method, which we obviously do not support.
        .send({ high: 'life' })
        .expect('Content-Type', /application\/json/)
        .expect(405)
        .end((err, res) => {
            t.equals(err, null, 'Should not return any errors.');
            t.deepEquals(res.body, {
                err: true,
                message: 'Method Not Allowed',
            }, "Should respond with a 405 'Method Not Allowed' response.");
            freshServer.close();
            t.end();
        });
});

test('✨ SERVER — server should return a 500 error on uncaught errors and still keep running.', t => {
    t.plan(3);
    const endpoint = '/error';
    const responseMessage = 'oops';
    // Attach router that throws an unhandled error.
    router.get(endpoint, async () => {
        throw new Error(responseMessage);
    });
    const freshServer = server.listen();
    disableErrorConsole();
    supertest(server)
        .get(endpoint)
        .expect('Content-Type', /application\/json/)
        .expect(500)
        .end((err, res) => {
            t.equals(err, null, 'Should not return any errors.');
            t.deepEquals(res.body, {
                err: true,
                msg: responseMessage,
            }, "Should respond with a 500 'Internal Server Error' response.");
            t.equals(freshServer.listening, true, 'Server should still be running.');
            freshServer.close();
            t.end();
        });
});

test('✨ SERVER — server process handle unhandled promise rejections and still keep running.', t => {
    t.plan(3);
    const endpoint = '/promise_reject';
    const responseMessage = 'oops';
    disableErrorConsole();
    // Attach router that throws an unhandled promise rejection.
    router.get(endpoint, async () => {
        return Promise.reject(new Error(responseMessage));
    });
    const freshServer = server.listen();
    supertest(server)
        .get(endpoint)
        .expect('Content-Type', /application\/json/)
        .expect(500)
        .end((err, res) => {
            enableErrorConsole();
            t.equals(err, null, 'Should not return any errors.');
            t.deepEquals(res.body, {
                err: true,
                msg: responseMessage,
            }, "Should respond with a 500 'Internal Server Error' response.");
            t.equals(freshServer.listening, true, 'Server should still be running.');
            freshServer.close();
            t.end();
        });
});
