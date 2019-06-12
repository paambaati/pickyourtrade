/**
 * Logger utility.
 */

import pino from 'pino';

export default class Logger {
    private options: pino.LoggerOptions;
    /**
     * Logger instance.
     * @memberof Logger
     */
    public logger: pino.Logger;
    /**
     * Creates an instance of Logger.
     * @param {string} appName Name of the app/module.
     * @param {pino.LoggerOptions} options Logger options.
     * @memberof Logger
     */
    constructor(private appName: string, options?: pino.LoggerOptions) {
        if (!options) {
            this.options = {
                name: this.appName,
                // Log levels - https://github.com/pinojs/pino/blob/master/docs/API.md#discussion-3
                level: process.env.LOG_LEVEL || 'info',
                useLevelLabels: true,
            };
        } else {
            this.options = {
                name: this.appName,
                ...options,
            };
        }
        this.options.enabled = (this.options.level !== 'silent');
        this.options.serializers = {
            err: pino.stdSerializers.err,
        };
        this.logger = pino(this.options);
        return this;
    }
}
