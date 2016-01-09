var MenuItem = require('menu-item');
var dialog = require('dialog');

var about = function () {
    return new MenuItem({
        label: 'About',
        click: function () {
            dialog.showMessageBox({
                title: 'About',
                message: 'DLNA Cast v0.1. Created by James Morgan.',
                detail: 'https://www.github.com/jamesmorgan/dlnacast',
                buttons: ["OK"]
            });
        }
    });
};

var quit = function (cb) {
    return new MenuItem({
        label: 'Quit',
        click: cb
    });
};

var separator = function () {
    return new MenuItem({type: 'separator'});
};

var upnpDeviceItem = function (device, onClickHandler) {
    var label = device.name + ' - ' + device.host;
    console.log('Adding Jongo Menu Item', device);
    return new MenuItem({
        label: label,
        click: onClickHandler
    });
};

var chromeCastItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Chromecast Menu Item', device);
    return new MenuItem({
        label: label,
        click: onClickHandler
    });
};

var chromeCastAudioItem = function (device, onClickHandler) {
    var label = device.name;
    console.log('Adding Chromecast Menu Item', device);
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
