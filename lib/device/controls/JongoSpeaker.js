var util = require('util');
var EventEmitter = require('events').EventEmitter;
var UpnpMediaClientUtils = require('../utils/UpnpMediaClientUtils');
var logger = require('../../common/logger');

var defaultStreamingOptions = {
    autoplay: true,
    contentType: 'audio/mpeg3',
    streamType: 'LIVE',
    metadata: {
        title: 'Streaming Mac OSX',
        creator: 'DeviceCast',
        type: 'audio'
    }
};

function JongoSpeaker(device) {
    this.device = device;
    util.inherits(JongoSpeaker, EventEmitter);
    EventEmitter.call(this);

    // Instantiate a client with a device description URL (discovered by SSDP)
    this.client = new MediaRendererClient(device.xmlRawLocation);

    // Simply adds in logging for all client event hooks
    UpnpMediaClientUtils.decorateClientMethodsForLogging(this.client);

}

JongoSpeaker.prototype.play = function (streamingAddress, callback) {

    this.client.load(streamingAddress, defaultStreamingOptions, function (err, result) {
        if (err) {
            logger.error('Error playing jongo', err);
            callback(err);
        } else {
            logger.debug('playing ...', result);
            callback(null, result);
        }
    });
};

JongoSpeaker.prototype.stop = function (callback) {

};
