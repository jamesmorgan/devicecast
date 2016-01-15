var path = require('path');
var Webcast = require('webcast-osx-audio');

var streamingAddress = null;

var startStream = function (onStreamingCallback, onErroCallback) {
    try {
        var options = {
            port: 3000,
            url: 'stream.mp3'
        };

        var webcast = new Webcast(options);
        console.log('Webcast kicking of', options);

        streamingAddress = 'http://' + webcast.ip + ':' + options.port + '/' + options.url;
        console.log('Webcast streaming address', streamingAddress);
        onStreamingCallback(streamingAddress);

    } catch (e) {
        console.log(e);
        streamingAddress = null;
        onErroCallback(e);
    }
};

var stopStream = function () {
};

module.exports = {
    startStream: startStream,
    stopStream: stopStream
};
