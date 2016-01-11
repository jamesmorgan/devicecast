var decorateClientMethodsForLogging = function (client) {
    client.on('status', function (status) {
        // Reports the full state of the AVTransport service the first time it fires,
        // then reports diffs. Can be used to maintain a reliable copy of the
        // service internal state.
        console.log('status', status);
    });

    client.on('loading', function () {
        console.log('loading');
    });

    client.on('playing', function () {
        console.log('playing');
        client.getPosition(function (err, position) {
            console.log('position', position); // Current position in seconds
        });
        client.getDuration(function (err, duration) {
            console.log('duration', duration); // Media duration in seconds
        });
    });

    client.on('paused', function () {
        console.log('paused');
    });

    client.on('stopped', function () {
        console.log('stopped');
    });

    client.on('speedChanged', function (speed) {
        // Fired when the user rewinds of fast-forwards the media from the remote
        console.log('speedChanged', speed);
    });
};

module.exports = {
    decorateClientMethodsForLogging: decorateClientMethodsForLogging
};
