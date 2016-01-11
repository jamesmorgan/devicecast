var path = require('path');

var webCastProcess = undefined;

function launchWebCastProcess(onStreamingCallback, onErroCallback) {
    webCastProcess = exec(path.join(__dirname, '../node ', __dirname, '../node_modules/.bin/webcast-audio'), {async: true});
    webCastProcess.stdout.on('data', function (data) {
        console.log("webcast-audio stream launched", data);
        var url = data.replace('streaming at ', '').replace(/(\n|\r)+$/, '').trim();
        onStreamingCallback(url);
    });
    webCastProcess.stderr.on('data', function (data) {
        console.log("webcast-audio error", data);
        onErroCallback(data);
    });
    webCastProcess.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
}

var startStream = function (onStreamingCallback, onErroCallback) {
    if (!webCastProcess) {
        launchWebCastProcess(onStreamingCallback, onErroCallback);
    }
};

var stopStream = function () {
    if (webCastProcess) {
        setTimeout(function () {
            console.log('kill');
            webCastProcess.stdin.pause();
            webCastProcess.kill();
            webCastProcess = undefined;
        }, 0);
    }
};

module.exports = {

    startStream: startStream,
    stopStream: stopStream
};
