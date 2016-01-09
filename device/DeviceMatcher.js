var isJongo = function (device) {
    return device.xml.search("<manufacturer>Pure</manufacturer>") !== -1;
};

var isChromecast = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1
        && device.xml.search("<modelName>Eureka Dongle</modelName>");
};

var isChromecastAudio = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1
        && device.xml.search("<modelName>Chromecast Audio</modelName>");
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
