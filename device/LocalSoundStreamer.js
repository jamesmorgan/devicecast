var path = require('path');

var webCastProcess = undefined;

function launchWebCastProcess(onStreamingCallback, onErroCallback) {
    webCastProcess = exec('./node_modules/.bin/webcast-audio', {async: true});
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

// Public
module.exports = {

    startStream: function (onStreamingCallback, onErroCallback) {
        if (!webCastProcess) {
            launchWebCastProcess(onStreamingCallback, onErroCallback);
        }
    },

    stopStream: function () {
        if (webCastProcess) {
            webCastProcess.kill();
            webCastProcess = undefined;
        }
    }
};
