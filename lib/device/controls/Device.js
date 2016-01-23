var util = require('util');

function Device(device) {

    var self = this;

    this.name = device.name;
    this.host = device.host;

    // keep ref to original device
    this._device = device;
}

Device.prototype.cast = function () {

};

Device.prototype.stop = function () {

};

module.exports = Device;
