var isJongo = function (device) {
    //var manufacturer = getManufacturer(device.xml);
    //var modelName = getModelName(device.xml);
    // TODO consider search e.g. xml.search("<manufacturer>Google Inc.</manufacturer>") == -1
    //return manufacturer.toLowerCase().indexOf("pure") && modelName.toLowerCase().indexOf("jongo");

    return device.xml.search("<manufacturer>Pure</manufacturer>") !== -1;
    //return true;
};

function getManufacturer(xml) {
    return xml.match(/<manufacturer>(.+?)<\/manufacturer>/)[1];
}
function getModelName(xml) {
    return xml.match(/<modelName>(.+?)<\/modelName>/)[1];
}

var isChromecast = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1;
    //return true;
};

var isChromecastAudio = function (device) {
    return device.xml.search("<manufacturer>Google Inc.</manufacturer>") !== -1;
    //return true;
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
