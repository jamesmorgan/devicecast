var Browser = require('nodecast-js');
var validUrl = require('valid-url');
var request = require('request');

var lookUpDevices = function (onDeviceFoundHandler) {

    var browser = new Browser();
    browser.onDevice(function (device) {
        device.onError(function (err) {
            console.error('Error', err);
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
            //console.log('####################');
            //console.log('body', body);
            //console.log('####################');
            handler(body);
        } else {
            handler(null);
        }
    }).on('error', function (err) {
        console.error(err);
        handler(null);
    });
}

function isUrl(url) {
    return validUrl.isUri(url);
}

module.exports = {
    lookUpDevices: lookUpDevices
};
