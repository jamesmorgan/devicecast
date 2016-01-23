var path = require('path');
var logger = require('../../common/logger');

var original_input;
var original_output;

// N:B - requires trailing space
var AUDIO_DEVICE_PATH = path.join(__dirname, '../../../audiodevice ');

// Sets OSX selected sound device
function setDevice(which, what) {
    exec(AUDIO_DEVICE_PATH + which + ' "' + what + '"', {async: true});
    // TODO handle not found - output = 'device not found!'
}

// Gets OSX currently selected sound device
function getDevice(which, callback) {
    exec(AUDIO_DEVICE_PATH + which, {async: true}).stdout.on('data', function (data) {
        var outputDevice = data.replace(/(\r\n|\n|\r)/gm, "");
        callback(outputDevice);
    });
}

var switchSource = function (options) {
    logger.info('Switching Audio source', options);
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
        logger.info('Resetting input device to', original_input);
        setDevice('input', original_input);
    }
    if (original_output) {
        logger.info('Resetting output device to', original_output);
        setDevice('output', original_output);
    }
};

module.exports = {
    switchSource: switchSource,
    resetOriginSource: resetOriginSource
};
