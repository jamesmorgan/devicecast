var MenuItem = require('menu-item');
var dialog = require('dialog');
var packageJson = require('../../package.json');
var logger = require('../common/logger');

var SOUND_ICON = String.fromCharCode('0xD83D', '0xDD0A');

var setSpeaker = function (menuItem) {
    menuItem.label = menuItem.label + ' ' + SOUND_ICON;
    logger.debug('Setting menu label to [%s]', menuItem.label);
};

var removeSpeaker = function (menuItem) {
    menuItem.label = menuItem.label.replace(' ' + SOUND_ICON, '');
    logger.debug('Removing menu label to [%s]', menuItem.label);
};

var about = function () {
    logger.debug('Adding About Menu Item');
    return new MenuItem({
        id: 'about',
        label: 'About',
        click: function () {
            dialog.showMessageBox({
                title: 'About',
                message: packageJson.name + ' - v' + packageJson.version + '. ' + 'Created by ' + packageJson.author,
                detail: packageJson.description + ' \nProject: ' + packageJson.repository.url,
                buttons: ["OK"]
            });
        }
    });
};

var aboutStreamFeature = function () {
    logger.debug('Adding About Stream Feature Item');
    return new MenuItem({
        id: 'about-stream',
        label: 'About This Feature',
        click: function () {
            dialog.showMessageBox({
                title: 'Stream Selection',
                message: 'You can cast OSX Audio Output (default) or you\'re Internal Microphone.',
                detail: 'Casting the Internal Microphone turns the speaker into a mega-phone!',
                buttons: ["OK"]
            });
        }
    });
};

var quit = function (cb) {
    logger.debug('Adding Quit Menu Item');
    return new MenuItem({
        id: 'quit',
        label: 'Quit',
        click: cb
    });
};

var separator = function () {
    return new MenuItem({type: 'separator'});
};

var sonosDeviceItem = function (device, onClickHandler) {
    var label = device.name;
    logger.debug('Adding Sonos Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var jongoDeviceItem = function (device, onClickHandler) {
    var label = device.name;
    logger.debug('Adding Jongo Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var chromeCastItem = function (device, onClickHandler) {
    var label = device.name;
    logger.debug('Adding Chromecast Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var chromeCastAudioItem = function (device, onClickHandler) {
    var label = device.name;
    logger.debug('Adding Chromecast Audio Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var castToDeviceMenu = function (menu) {
    logger.debug('Adding cast to device menu');
    return new MenuItem({
        label: 'Cast to Device',
        submenu: menu
    })
};

var steamMenu = function (menu) {
    logger.debug('Adding stream menu');
    return new MenuItem({
        label: 'Stream',
        submenu: menu
    });
};

var scanningForDevices = function () {
    logger.debug('Adding Scanning for Devices...');
    return new MenuItem({
        label: 'Scanning for Devices...'
    });
};

module.exports = {
    setSpeaker: setSpeaker,
    removeSpeaker: removeSpeaker,
    about: about,
    aboutStreamFeature: aboutStreamFeature,
    quit: quit,
    scanningForDevices: scanningForDevices,
    separator: separator,
    sonosDeviceItem: sonosDeviceItem,
    castToDeviceMenu: castToDeviceMenu,
    steamMenu: steamMenu,
    jongoDeviceItem: jongoDeviceItem,
    chromeCastItem: chromeCastItem,
    chromeCastAudioItem: chromeCastAudioItem
};
