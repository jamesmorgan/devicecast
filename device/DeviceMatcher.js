var isJongo = function (device) {
    return device.xml.search("<manufacturer>Pure</manufacturer>") !== -1;
};

var isChromecast = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1
        && device.xml.search("<modelName>Eureka Dongle</modelName>") !== -1;
};

var isChromecastAudio = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1
        && device.xml.search("<modelName>Chromecast Audio</modelName>") !== -1;
};

module.exports = {
    isJongo: isJongo,
    isChromecast: isChromecast,
    isChromecastAudio: isChromecastAudio,
    TYPES: {
        CHROMECAST: 'chc',
        UPNP: 'upnp'
    }
};
