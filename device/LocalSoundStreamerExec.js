var path = require('path');
var exec = require('child_process').exec;

var webCastProcess = undefined;

var startStream = function (onStreamingCallback, onErrorCallback) {
    console.log('Attempting to start stream using exec');

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
    webCastProcess = exec(path.join(__dirname, '../node_modules/.bin/webcast-audio') + ' ' + mono + ' ' + bitrate + ' ' + name);
    //webCastProcess = exec(path.join(__dirname, '../node_modules/.bin/webcast-audio'));

    webCastProcess.stdout.on('data', function (data) {
        console.log("webcast-audio stream launched", data);
        var url = data.replace('streaming at ', '').replace(/(\n|\r)+$/, '').trim();
        onStreamingCallback(url);
    });
    webCastProcess.stderr.on('data', function (data) {
        console.log("webcast-audio error", data);
        onErrorCallback(data);
    });
    webCastProcess.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
};

var stopStream = function () {
    if (webCastProcess) {
        console.log('Attempting to kill streaming process');
        //if (webCastProcess.stdout && webCastProcess.stdout.pause) {
        //    webCastProcess.stdout.pause();
        //}
        //if (webCastProcess.stderr && webCastProcess.stderr.pause) {
        //    webCastProcess.stderr.pause();
        //}
        webCastProcess.kill();
        webCastProcess = undefined;
    }
};

module.exports = {

    startStream: startStream,
    stopStream: stopStream
};
