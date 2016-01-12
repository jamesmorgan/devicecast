var MenuItem = require('menu-item');
var dialog = require('dialog');
var packageJson = require('../package.json');

var SOUND_ICON = String.fromCharCode('0xD83D', '0xDD0A');

var setSpeaker = function (menuItem) {
    menuItem.label = menuItem.label + ' ' + SOUND_ICON;
};

var removeSpeaker = function (menuItem) {
    menuItem.label = menuItem.label.replace(' ' + SOUND_ICON, '');
};

var about = function () {
    console.log('Adding About Menu Item');
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

var quit = function (cb) {
    console.log('Adding Quit Menu Item');
    return new MenuItem({
        id: 'quit',
        label: 'Quit',
        click: cb
    });
};

var separator = function () {
    return new MenuItem({type: 'separator'});
};

var jongoDeviceItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Jongo Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var chromeCastItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Chromecast Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var chromeCastAudioItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Chromecast Audio Menu Item [%s]', label);
    return new MenuItem({
        id: device.name,
        label: label,
        click: onClickHandler
    });
};

var castToDeviceMenu = function (menu) {
    console.log('Adding cast to device menu');
    return new MenuItem({
        label: 'Cast to Device',
        submenu: menu
    })
};

var scanningForDevices = function () {
    console.log('Adding Scanning for Devices...');
    return new MenuItem({
        label: 'Scanning for Devices...'
    });
};

module.exports = {
    setSpeaker: setSpeaker,
    removeSpeaker: removeSpeaker,
    about: about,
    quit: quit,
    scanningForDevices: scanningForDevices,
    separator: separator,
    castToDeviceMenu: castToDeviceMenu,
    jongoDeviceItem: jongoDeviceItem,
    chromeCastItem: chromeCastItem,
    chromeCastAudioItem: chromeCastAudioItem
};
