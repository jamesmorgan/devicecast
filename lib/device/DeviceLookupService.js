var Browser = require('nodecast-js');
var validUrl = require('valid-url');
var request = require('request');
var logger = require('../common/logger');

var lookUpDevices = function (onDeviceFoundHandler) {

    var browser = new Browser();
    browser.onDevice(function (device) {
        logger.info('Found Device [%s]', device.name);
        device.onError(function (err) {
            logger.error('Device Error', err);
        });

        if (isUrl(device.xml)) {
            attemptToLoadXml(device.xml, function (rawXml) {
                device.xmlRawLocation = device.xml;
                device.xml = rawXml;
                onDeviceFoundHandler(device);
            })
        } else {
            onDeviceFoundHandler(device);
        }
    });
    browser.start();
};

function attemptToLoadXml(url, handler) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logger.verbose('Loaded XML schema for device', {
                url: url,
                body: body
            });
            handler(body);
        } else {
            logger.info('Failed to loaded XML schema for device', {url: url});
            handler(null);
        }
    }).on('error', function (err) {
        logger.error('Error when attempting to load schema for device', {
            url: url,
            error: err
        });
        handler(null);
    });
}

function isUrl(url) {
    return validUrl.isUri(url);
}

module.exports = {
    lookUpDevices: lookUpDevices
};
