var path = require('path');
var exec = require('child_process').exec;
var logger = require('../common/logger');

var webCastProcess = undefined;

var startStream = function (callback) {
    logger.debug('Attempting to start stream using exec');

    var mono = '--m mono';
    var bitrate = '--b 256';
    var name = '--u stream.mp3';
    /*
     -p, --port        The port that the streaming server will listen on.  [3000]
     -b, --bitrate     The bitrate for the mp3 encoded stream.  [192]
     -m, --mono        The stream defaults to stereo. Set to mono with this flag.
     -s, --samplerate  The sample rate for the mp3 encoded stream.  [44100]
     -u, --url         The relative URL that the stream will be hosted at.  [stream.mp3]
     */
    // TODO launch with node version as only compatible with v10
    webCastProcess = exec(path.join(__dirname, '../../node_modules/.bin/webcast-audio') + ' ' + mono + ' ' + bitrate + ' ' + name);

    webCastProcess.stdout.on('data', function (data) {
        logger.info("webcast-audio stream launched", data);
        var streamUrl = data.replace('streaming at ', '').replace(/(\n|\r)+$/, '').trim();
        callback(null, streamUrl);
    });
    webCastProcess.stderr.on('data', function (data) {
        logger.error("webcast-audio error", data);
        callback(data);
    });
    webCastProcess.on('exit', function (code) {
        logger.error('child process exited with code ' + code);
    });
};

var stopStream = function () {
    if (webCastProcess) {
        logger.info('Attempting to kill streaming process');
        webCastProcess.kill();
        webCastProcess = undefined;
    }
};

module.exports = {
    startStream: startStream,
    stopStream: stopStream
};
