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

/* Internals */
var MenuFactory = require('./lib/native/MenuFactory');
var NotificationService = require('./lib/native/NotificationService');

var DeviceLookupService = require('./lib/device/utils/DeviceLookupService');
var DeviceMatcher = require('./lib/device/utils/DeviceMatcher');
var LocalSourceSwitcher = require('./lib/device/utils/LocalSourceSwitcher');
var UpnpMediaClientUtils = require('./lib/device/utils/UpnpMediaClientUtils');

var LocalSoundStreamer = require('./lib/sound/LocalSoundStreamerExec');

/* Various Device controllers */
var JongoSpeaker = require('./lib/device/controls/JongoSpeaker');
var ChromeCast = require('./lib/device/controls/ChromeCast');

var logger = require('./lib/common/logger');

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
            logger.debug('TODO - Refresh Items');
        }
    }));
    deviceListMenu.append(MenuFactory.separator());

    var devicesAdded = [];

    var streamingAddress;

    LocalSoundStreamer.startStream(function (err, streamUrl) {
        if (err) {
            logger.info('Streaming process died', err);
            dialog.showMessageBox({
                title: 'Error',
                message: 'Streaming has crashed, you may need to restart the application!',
                detail: err.toString(),
                buttons: ["OK"]
            });
        } else {
            streamingAddress = streamUrl;
        }
    });

    DeviceLookupService.lookUpDevices(function onDevice(device) {

        // Disable the 'Scanning for Devices...'
        menu.items[0].enabled = false;

        switch (device.type) {
            case DeviceMatcher.TYPES.CHROMECAST:
                if (DeviceMatcher.isChromecast(device) || DeviceMatcher.isChromecastAudio(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.chromeCastItem(device, function onClicked() {
                        logger.info('Attempting to play to Chromecast', device.name);

                        // Sets OSX selected input and output audio devices to Soundflower
                        LocalSourceSwitcher.switchSource({
                            output: 'Soundflower (2ch)',
                            input: 'Soundflower (2ch)'
                        });

                        if (!device.controls) {
                            device.controls = new ChromeCast(device);
                        }
                        device.controls.play(streamingAddress, onStreamingUpdateUI.bind({device: device}));
                    }));
                }
                break;
            case DeviceMatcher.TYPES.UPNP:

                if (DeviceMatcher.isSonos(device)) {
                    devicesAdded.push(device);
                    deviceListMenu.append(MenuFactory.sonosDeviceItem(device, function onClicked() {
                        logger.debug('TODO Sonos');
                        // TODO on click integrate with sonos
                    }));
                }
                else if (DeviceMatcher.isJongo(device)) {
                    devicesAdded.push(device);

                    deviceListMenu.append(MenuFactory.jongoDeviceItem(device, function onClicked() {
                        logger.info('Attempting to play to Jongo device', device.name);

                        // Sets OSX selected input and output audio devices to Soundflower
                        LocalSourceSwitcher.switchSource({
                            output: 'Soundflower (2ch)',
                            input: 'Soundflower (2ch)'
                        });

                        if (!device.controls) {
                            device.controls = new JongoSpeaker(device);
                        }
                        device.controls.play(streamingAddress, onStreamingUpdateUI.bind({device: device}));
                    }));
                }
                break;
            default:
                logger.error('Unknown recognised device found', logger.level === 'verbose' ? device : device.name);
        }

        // Reset the menu items
        mb.tray.setContextMenu(menu);
    });

    //Clicking this option stops casting audio to Chromecast
    menu.append(new MenuItem({
        label: 'Stop casting',
        enabled: true, // default disabled as not initially playing
        click: function () {

            // Attempt to stop all controls
            devicesAdded.forEach(function (device) {
                if (device && device.controls && _.isFunction(device.controls.stop)) {
                    device.controls.stop(function (err, result) {
                        // do something...
                    });
                } else {
                    logger.debug('Unknown handled device', _.keys(device))
                }
            });

            // Clean up playing speaker icon
            deviceListMenu.items.forEach(MenuFactory.removeSpeaker);

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

    var setSpeakIcon = function (item) {
        if (item.label === this.device.name) {
            MenuFactory.setSpeaker(item);
        } else {
            MenuFactory.removeSpeaker(item);
        }
    };

    var onQuitHandler = function () {
        mb.tray.setImage(path.join(__dirname, 'not-castingTemplate.png'));
        LocalSoundStreamer.stopStream();
        LocalSourceSwitcher.resetOriginSource();
        mb.app.quit();
    };

    var onStreamingUpdateUI = function () {
        //Disables all devices until further stop
        deviceListMenu.items.forEach(disableAllItems);

        // set speak icon when playing
        deviceListMenu.items.forEach(setSpeakIcon.bind({device: this.device}));

        // Enable 'Stop Casting' item
        menu.items[2].enabled = true;

        // Changes tray icon to "Casting"
        mb.tray.setImage(path.join(__dirname, 'castingTemplate.png'));
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
