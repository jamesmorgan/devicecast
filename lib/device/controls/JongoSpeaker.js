var util = require('util');
var EventEmitter = require('events').EventEmitter;
var UpnpMediaClientUtils = require('../utils/UpnpMediaClientUtils');
var logger = require('../../common/logger');
var NotificationService = require('../../native/NotificationService');
var MediaRendererClient = require('upnp-mediarenderer-client');

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
    this.device.controls = this;

    util.inherits(JongoSpeaker, EventEmitter);
    EventEmitter.call(this);

    // Instantiate a client with a device description URL (discovered by SSDP)
    this.client = new MediaRendererClient(device.xmlRawLocation);

    // Simply adds in logging for all client event hooks
    UpnpMediaClientUtils.decorateClientMethodsForLogging(this.client);
}

JongoSpeaker.prototype.play = function (streamingAddress, callback) {
    logger.info("Calling load() on device [%s]", this.device.name + ' - ' + this.device.host);

    this.client.load(streamingAddress, defaultStreamingOptions, function (err, result) {
        if (err) {
            logger.error('Error playing jongo', err);
            NotificationService.notifyCastingStopped(this.device);
            callback(err);
        } else {
            NotificationService.notifyCastingStarted(this.device);
            logger.debug('playing ...', result);
            callback(null, result);
        }
    }.bind(this));
};

JongoSpeaker.prototype.stop = function (callback) {
    this.client.stop(function (err, result) {
        if (err) {
            logger.error('Error stopping jonog', err);
            callback(err, null);
        } else {
            logger.debug('Stopped jongi', result);
            NotificationService.notifyCastingStopped(this.device);
            callback(null, result);
        }
    }.bind(this));
};

module.exports = JongoSpeaker;
