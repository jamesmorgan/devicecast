'use strict';
var winston = require('winston');
var config = require('../../config.json');
var _ = require('lodash');

winston.emitErrs = true;

var level = _.get(config, 'logger.level', 'debug');
console.log('Logger level set to', level);

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        }),
        new (winston.transports.File)({
            level: 'error',
            filename: './logs/error.log',
            json: false,
            timestamp: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: false,
    level: level,
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        verbose: 4, // switched verbose and debug around
        silly: 5
    }
});

module.exports = logger;
