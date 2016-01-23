var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger = require('../../common/logger');
var NotificationService = require('../../native/NotificationService');
var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;

function ChromeCast(device) {
    this.device = device;

    util.inherits(ChromeCast, EventEmitter);
    EventEmitter.call(this);

    // Attach client to the device
    this.client = new Client();

    this.client.on('error', function (err) {
        logger.error('Unknown error from chromecast', err);
        this.client.close();
    }.bind(this));

}

ChromeCast.prototype.play = function (streamingAddress, callback) {
    var self = this;

    this.client.connect(this.device.host, function () {
        console.log('connected, launching app ...');

        this.client.launch(DefaultMediaReceiver, function (err, player) {
            if (err) {
                NotificationService.notifyCastingStopped(this.device);
                callback(err, null);
            } else {

                NotificationService.notifyCastingStarted(this.device);

                self.player = player;

                var media = {
                    // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
                    contentId: streamingAddress,
                    contentType: 'audio/mpeg3',
                    streamType: 'LIVE', // BUFFERED or LIVE

                    // Title and cover displayed while buffering
                    metadata: {
                        type: 0,
                        //type: 'audio',
                        metadataType: 0,
                        title: "Streaming Mac OSX",
                        images: [],
                        creator: 'DeviceCast'
                    }
                };

                player.on('status', function (status) {
                    console.log('status broadcast playerState=%s', status.playerState);
                });

                console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

                player.load(media, {autoplay: true}, function (err, status) {
                    console.log('media loaded playerState=%s', status.playerState);

                    //// Seek to 2 minutes after 15 seconds playing.
                    //setTimeout(function () {
                    //    player.seek(2 * 60, function (err, status) {
                    //        //
                    //    });
                    //}, 15000);
                });
            }
        }.bind(this));
    }.bind(this));
};

ChromeCast.prototype.stop = function (callback) {
    if (this.player && this.player.stop) {
        this.player.stop(callback);
        NotificationService.notifyCastingStopped(this.device);
    }
};

module.exports = ChromeCast;
