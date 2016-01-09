//Audiodevice by http://whoshacks.blogspot.com/2009/01/change-audio-devices-via-shell-script.html

//Shell and filesystem dependencies
require('shelljs/global');
var path = require('path');

//Electron dependencies
var menubar = require('menubar');
var Menu = require('menu');
var MenuItem = require('menu-item');
var dialog = require('dialog');
var mb = menubar({dir: __dirname + '/assets/', icon: 'not-castingTemplate.png'});

var MediaRendererClient = require('upnp-mediarenderer-client');

var MenuFactory = require('./menu/MenuFactory');
var DeviceLookupService = require('./device/DeviceLookupService');
var DeviceMatcher = require('./device/DeviceMatcher');
var LocalSourceSwitcher = require('./device/LocalSourceSwitcher');
var LocalSoundStreamer = require('./device/LocalSoundStreamer');

//Menubar construction
mb.on('ready', function ready() {
    //Menu startup message
    var menu = new Menu();
    var deviceListMenu = new Menu();

    // Initial scanning for devices menu added
    menu.append(MenuFactory.scanningForDevices());

    // Clicking this option starts casting audio to Cast
    menu.append(MenuFactory.castToDeviceMenu(deviceListMenu));

    //Refresh
    deviceListMenu.append(new MenuItem({
        label: 'Refresh Devices...',
        click: function () {
            // Re-enable 'Scanning for Devices...'
            menu.items[0].enabled = true;
            for (var j = 0; j < deviceListMenu.items.length; j++) {
                //deviceListMenu.items[j].enabled = true;
            }
        }
    }));
    deviceListMenu.append(MenuFactory.separator());

    var devicesFound = [];
    var devicesAdded = [];

    var streamingAddress;

    var onStreamingStarted = function onStreaming(streamUrl) {
        streamingAddress = streamUrl;
    };
    var onStreamFailed = function onError(err) {

    };
    LocalSoundStreamer.startStream(onStreamingStarted, onStreamFailed);

    DeviceLookupService.lookUpDevices(function onDevice(device) {
        //console.log("###############");
        //console.log('DEVICE', device);
        //console.log("###############");
        devicesFound.push(device);

        // Disable the 'Scanning for Devices...'
        menu.items[0].enabled = false;

        switch (device.type) {
            case DeviceMatcher.TYPES.CHROMECAST:

                if (DeviceMatcher.isChromecast(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.chromeCastItem(device, function onClicked() {
                        console.log('Adding Chromecast Menu Item');
                    }));
                }
                else if (DeviceMatcher.isChromecastAudio(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.chromeCastAudioItem(device, function onClicked() {
                        console.log('Adding Chromecast Audio Menu Item');
                    }));
                }
                // TODO Ruko Support
                break;
            case DeviceMatcher.TYPES.UPNP:
                if (DeviceMatcher.isJongo(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.upnpDeviceItem(device, function onClicked() {
                        console.log('Attempting to play to Jongo device');

                        //Sets OSX selected input and output audio devices to Soundflower
                        LocalSourceSwitcher.switchSource({
                            output: 'Soundflower (2ch)',
                            input: 'Soundflower (2ch)'
                        });

                        // Instanciate a client with a device description URL (discovered by SSDP)
                        var client = new MediaRendererClient(device.xmlRawLocation);

                        client.on('status', function (status) {
                            // Reports the full state of the AVTransport service the first time it fires,
                            // then reports diffs. Can be used to maintain a reliable copy of the
                            // service internal state.
                            console.log('status', status);
                        });

                        client.on('loading', function () {
                            console.log('loading');
                        });

                        client.on('playing', function () {
                            console.log('playing');

                            client.getPosition(function (err, position) {
                                console.log('position', position); // Current position in seconds
                            });
                            client.getDuration(function (err, duration) {
                                console.log('duration', duration); // Media duration in seconds
                            });
                        });

                        client.on('paused', function () {
                            console.log('paused');
                        });

                        client.on('stopped', function () {
                            console.log('stopped');
                        });

                        client.on('speedChanged', function (speed) {
                            // Fired when the user rewinds of fast-forwards the media from the remote
                            console.log('speedChanged', speed);
                        });

                        // Load a stream with subtitles and play it immediately
                        var options = {
                            autoplay: true
                            //contentType: 'mp4/avi',
                            //metadata: {
                            //    title: 'Some Movie Title',
                            //    creator: 'John Doe',
                            //    type: 'audio', // can be 'video', 'audio' or 'image'
                            //    subtitlesUrl: 'http://url.to.some/subtitles.srt'
                            //}
                        };

                        client.load(streamingAddress, options, function (err, result) {
                            if (err) throw err;
                            console.log('playing ...');
                        });

                    }));
                }
                break;
            default:
                console.error('Unknown device type', device);
        }
        // Reset the menu items
        mb.tray.setContextMenu(menu);
    });

    //Clicking this option stops casting audio to Chromecast
    menu.append(new MenuItem({
        label: 'Stop casting',
        click: function () {
            LocalSoundStreamer.stopStream();
        }
    }));

    // About
    menu.append(MenuFactory.about());

    var onQuitHandler = function () {
        LocalSoundStreamer.stopStream();
        LocalSourceSwitcher.resetOriginSource();
        mb.app.quit();
    };

    // Quit
    menu.append(MenuFactory.quit(onQuitHandler));
    // CMD + C death
    mb.app.on('quit', onQuitHandler);

    // Set the menu items
    mb.tray.setContextMenu(menu);

});
