var logger = require('../../common/logger');

/**
 *
 * @param client
 */
var decorateClientMethodsForLogging = function (client) {
    client.on('status', function (status) {
        // Reports the full state of the AVTransport service the first time it fires,
        // then reports diffs. Can be used to maintain a reliable copy of the
        // service internal state.
        logger.debug('status', status);
    });

    client.on('loading', function () {
        logger.debug('loading');
    });

    client.on('playing', function () {
        logger.debug('playing');
        client.getPosition(function (err, position) {
            logger.debug('position', position); // Current position in seconds
        });
        client.getDuration(function (err, duration) {
            logger.debug('duration', duration); // Media duration in seconds
        });
    });

    client.on('paused', function () {
        logger.debug('paused');
    });

    client.on('stopped', function () {
        logger.debug('stopped');
    });

    client.on('speedChanged', function (speed) {
        // Fired when the user rewinds of fast-forwards the media from the remote
        logger.debug('speedChanged', speed);
    });
};

module.exports = {
    decorateClientMethodsForLogging: decorateClientMethodsForLogging
};
