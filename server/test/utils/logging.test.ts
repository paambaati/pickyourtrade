import test from 'tape';
import Logger from '../../src/utils/logging';

/**
 * Tests.
 */

test('✨ UTILS/logging — Constructor should allow override of log level.', t => {
    t.plan(1);
    const logLevel = 'silent';
    const logger = new Logger('tests', {
        level: logLevel,
    }).logger;
    t.equals(logger.level, logLevel, 'Default log level should be overridden.');
    t.end();
});

test("✨ UTILS/logging — Constructor should default to log level 'info' if LOG_LEVEL is unset.", t => {
    t.plan(1);
    process.env.LOG_LEVEL = ''; // This is how you unset an env var in Node. See https://github.com/nodejs/node/issues/9248
    const logger = new Logger('tests').logger;
    t.equals(logger.level, 'info', 'Log level should fallback to default.');
    t.end();
});
