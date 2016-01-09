var path = require('path');

var original_input;
var original_output;

// Sets OSX selected sound device
function setDevice(which, what) {
    exec('./audiodevice ' + which + ' "' + what + '"', {async: true});
    // TODO handle not found - output = 'device not found!'
}

// Gets OSX currently selected sound device
function getDevice(which, callback) {
    exec('./audiodevice ' + which, {async: true}).stdout.on('data', function (data) {
        var outputDevice = data.replace(/(\r\n|\n|\r)/gm, "");
        callback(outputDevice);
    });
}

var switchSource = function (options) {
    if (options.input) {
        if (!original_input) {
            getDevice('input', function (data) {
                original_input = data;
            });
        }
        setDevice('input', options.input);
    }

    if (options.output) {
        if (!original_output) {
            getDevice('output', function (data) {
                original_output = data;
            });
        }
        setDevice('output', options.output);
    }
};

var resetOriginSource = function () {
    if (original_input) {
        setDevice('input', original_input);
    }
    if (original_output) {
        setDevice('output', original_output);
    }
};

module.exports = {
    switchSource: switchSource,
    resetOriginSource: resetOriginSource
};
