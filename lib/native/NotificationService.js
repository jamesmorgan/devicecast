var notifier = require('node-notifier');
var logger = require('../common/logger');
var path = require('path');

var notifyCastingStarted = function (device) {
    notifier.notify({
        title: 'Casting',
        message: device.name,
        icon: path.join(__dirname, 'castingTemplate.png'),
        //appIcon: path.join(__dirname, 'castingTemplate.png'),
        //contentImage: path.join(__dirname, 'castingTemplate.png'),
        //sender: path.join(__dirname, 'castingTemplate.png'),
        wait: false,
        sticky: false
    });
};

var notifyCastingStopped = function (device) {
    notifier.notify({
        title: 'Stopped',
        message: device.name,
        icon: path.join(__dirname, 'not-castingTemplate.png'),
        //appIcon: path.join(__dirname, 'not-castingTemplate.png'),
        //contentImage: path.join(__dirname, 'not-castingTemplate.png'),
        //sender: path.join(__dirname, 'not-castingTemplate.png'),
        wait: false,
        sticky: false
    });
};

module.exports = {
    notifyCastingStarted: notifyCastingStarted,
    notifyCastingStopped: notifyCastingStopped
};
