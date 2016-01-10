var MenuItem = require('menu-item');
var dialog = require('dialog');
var packageJson = require('../package.json');

var about = function () {
    console.log('Adding About Menu Item');
    return new MenuItem({
        label: 'About',
        click: function () {
            dialog.showMessageBox({
                title: 'About',
                message: 'DLNA Cast v' + packageJson.version + '. Created by James Morgan.',
                detail: packageJson.repository.url,
                buttons: ["OK"]
            });
        }
    });
};

var quit = function (cb) {
    console.log('Adding Quit Menu Item');
    return new MenuItem({
        label: 'Quit',
        click: cb
    });
};

var separator = function () {
    return new MenuItem({type: 'separator'});
};

var upnpDeviceItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Jongo Menu Item [%s]', label);
    return new MenuItem({
        label: label,
        click: onClickHandler
    });
};

var chromeCastItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Chromecast Menu Item [%s]', label);
    return new MenuItem({
        label: label,
        click: onClickHandler
    });
};

var chromeCastAudioItem = function (device, onClickHandler) {
    var icon = String.fromCharCode('0xD83D', '0xDD0A');
    var label = device.name + ' ' + icon;
    console.log('Adding Chromecast Audio Menu Item [%s]', label);
    return new MenuItem({
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
    console.log('Scanning for Devices...');
    return new MenuItem({
        label: 'Scanning for Devices...'
    });
};

module.exports = {
    about: about,
    quit: quit,
    scanningForDevices: scanningForDevices,
    separator: separator,
    castToDeviceMenu: castToDeviceMenu,
    upnpDeviceItem: upnpDeviceItem,
    chromeCastItem: chromeCastItem,
    chromeCastAudioItem: chromeCastAudioItem
};
