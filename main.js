//Audiodevice by http://whoshacks.blogspot.com/2009/01/change-audio-devices-via-shell-script.html

//Shell and filesystem dependencies
require('shelljs/global');
var path = require('path');
var _ = require('lodash');

//Electron dependencies
var menubar = require('menubar');
var Menu = require('menu');
var MenuItem = require('menu-item');
var dialog = require('dialog');
var mb = menubar({dir: __dirname, icon: 'not-castingTemplate.png'});

var MediaRendererClient = require('upnp-mediarenderer-client');

var MenuFactory = require('./menu/MenuFactory');

var DeviceLookupService = require('./device/DeviceLookupService');
var DeviceMatcher = require('./device/DeviceMatcher');
var LocalSourceSwitcher = require('./device/LocalSourceSwitcher');
var LocalSoundStreamer = require('./device/LocalSoundStreamerExec');
//var LocalSoundStreamer = require('./device/LocalSoundStreamerWebcast');
var UpnpMediaClientUtils = require('./device/UpnpMediaClientUtils');

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
        }
    }));
    deviceListMenu.append(MenuFactory.separator());

    var devicesFound = [];
    var devicesAdded = [];

    var streamingAddress;

    var streamingOptions = {
        autoplay: true,
        contentType: 'audio/mpeg3',
        streamType: 'LIVE',
        metadata: {
            title: 'Streaming Mac OSX',
            creator: 'DeviceCast',
            type: 'audio'
        }
    };

    var onStreamingStarted = function onStreaming(streamUrl) {
        streamingAddress = streamUrl;
    };

    var onStreamFailed = function onError(err) {
        console.log('Streaming process died', err);
        dialog.showMessageBox({
            title: 'Error',
            message: 'Streaming has crashed, you may need to restart the application!',
            detail: err.toString(),
            buttons: ["OK"]
        });
    };

    LocalSoundStreamer.startStream(onStreamingStarted, onStreamFailed);

    DeviceLookupService.lookUpDevices(function onDevice(device) {
        devicesFound.push(device);

        console.log('Found Device', device.name);

        // Disable the 'Scanning for Devices...'
        menu.items[0].enabled = false;

        switch (device.type) {
            case DeviceMatcher.TYPES.CHROMECAST:

                if (DeviceMatcher.isChromecast(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.chromeCastItem(device, function onClicked() {
                        console.log('TODO Chromecast Audio');
                    }));
                }
                else if (DeviceMatcher.isChromecastAudio(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.chromeCastAudioItem(device, function onClicked() {
                        console.log('TODO Chromecast Audio');
                    }));
                }

                break;
            case DeviceMatcher.TYPES.UPNP:

                if (DeviceMatcher.isSonos(device)) {
                    devicesAdded.push(device);

                    deviceListMenu.append(MenuFactory.sonosDeviceItem(device, function onClicked() {
                        console.log('TODO Sonos');
                        // TODO on click integrate with sonos
                    }));

                }
                else if (DeviceMatcher.isJongo(device)) {
                    devicesAdded.push(device);

                    deviceListMenu.append(MenuFactory.jongoDeviceItem(device, function onClicked() {
                        console.log('Attempting to play to Jongo device');

                        // Sets OSX selected input and output audio devices to Soundflower
                        LocalSourceSwitcher.switchSource({
                            output: 'Soundflower (2ch)',
                            input: 'Soundflower (2ch)'
                        });

                        if (device.client) {
                            console.log("Calling load() on device [%s]", device.name + ' - ' + device.host);
                            device.client.load(streamingAddress, streamingOptions, function (err, result) {
                                if (err) throw err;
                                console.log('playing ...', result);

                                //Disables all devices until further stop
                                deviceListMenu.items.forEach(disableAllItems);

                                // Enable 'Stop Casting' item
                                menu.items[2].enabled = true;

                                // Changes tray icon to "Casting"
                                mb.tray.setImage(path.join(__dirname, 'castingTemplate.png'));
                            });
                        }
                        else {

                            // Instantiate a client with a device description URL (discovered by SSDP)
                            var client = new MediaRendererClient(device.xmlRawLocation);

                            // Simply adds in logging for all client event hooks
                            UpnpMediaClientUtils.decorateClientMethodsForLogging(client);

                            // Attach client to the device
                            device.client = client;

                            client.load(streamingAddress, streamingOptions, function (err, result) {
                                if (err) throw err;
                                console.log('playing ...', result);

                                //Disables all devices until further stop
                                deviceListMenu.items.forEach(disableAllItems);

                                deviceListMenu.items.forEach(function (item) {
                                    console.log('item.id', item.id);
                                    if (item.id === device.name) {
                                        MenuFactory.setSpeaker(item);
                                    } else {
                                        MenuFactory.removeSpeaker(item);
                                    }
                                });

                                // Enable 'Stop Casting' item
                                menu.items[2].enabled = true;

                                // Changes tray icon to "Casting"
                                mb.tray.setImage(path.join(__dirname, 'castingTemplate.png'));
                            });
                        }
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
        enabled: false, // default disabled as not initially playing
        click: function () {

            // Attempt to kill all clients
            devicesAdded.forEach(function (device) {
                if (device && device.client) {
                    console.log("Calling stop() on device [%s]", device.name + ' - ' + device.host);
                    device.client.stop(function (err, result) {
                        if (err) {
                            console.error('Error stopping', err);
                        } else {
                            console.log('Stopped', result);
                        }
                    });
                }
            });

            // Re-Enable all devices until further notice
            for (var j = 0; j < deviceListMenu.items.length; j++) {
                deviceListMenu.items[j].enabled = true;
            }

            // Disable 'Stop Casting' item
            menu.items[2].enabled = false;

            // Switch tray icon
            mb.tray.setImage(path.join(__dirname, 'not-castingTemplate.png'));

            LocalSourceSwitcher.resetOriginSource();
        }
    }));

    var disableAllItems = function (item) {
        item.enabled = false
    };

    var onQuitHandler = function () {
        mb.tray.setImage(path.join(__dirname, 'not-castingTemplate.png'));
        LocalSoundStreamer.stopStream();
        LocalSourceSwitcher.resetOriginSource();
        mb.app.quit();
    };

    // About
    menu.append(MenuFactory.about());

    // Quit
    menu.append(MenuFactory.quit(onQuitHandler));

    // CMD + C death
    mb.app.on('quit', onQuitHandler);

    // Set the menu items
    mb.tray.setContextMenu(menu);

});
