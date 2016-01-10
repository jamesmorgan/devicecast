## DeviceCast

Based on the work done by [@andresgottlieb](https://github.com/andresgottlieb) and the project [Soundcast](https://github.com/andresgottlieb/soundcast) with help from some handy libraries such as:
 * [electron]() - allowing me to quickly build Mac OSX apps in javascript.
 * [nodecast-js](https://github.com/gyzerok/nodecast-js) - allowing me to scan the network and locate Chromecasts & UPNP devices.
 * [webcast-osx-audio](https://github.com/fardog/node-webcast-osx-audio) - for providing me with access to Mac OSX audio as a web stream.
 * [upnp-mediarenderer-client](https://github.com/thibauts/node-upnp-mediarenderer-client) - for facilitation of the routing of the web stream to a UPNP device.

### Reasoning

Primarily driven from the need to stream audio from my Mac Book to a set of recently purchased [Pure](http://www.pure.com/) [Jongo](http://www.pure.com/wireless-speakers?sort=&page=1&filter_ranges=3&filter_colors=) speakers.
After having issues with bluetooth connectivity and problems with the range bluetooth offers, I created this small application.
This applications aims to eliminate this restrictions of bluetooth's range by using UPNP over WIFI for better performance, namely distance from source to speaker.

![V0.1.0](/screenshots/screenshot-v0.1.0-menu.png "V0.1.0")

### Installation

1. Download and install [Soundflower v2.0b2](https://github.com/mattingalls/Soundflower/releases/download/2.0b2/Soundflower-2.0b2.dmg) (if you have a previous version, follow [this instructions](https://support.shinywhitebox.com/hc/en-us/articles/202751790-Uninstalling-Soundflower) to uninstall it and then install v2.0b2).
2. _checkout & build_ `npm install && ./build_app.sh`
 **OR**
  _checkout & hack_ `npm install && ./run_app.sh`
3. If you want it to start automatically with your computer do [this](http://www.howtogeek.com/206178/mac-os-x-change-which-apps-start-automatically-at-login/).

## Mac OS X El Capitan

Soundflower to v2.0b2 is required for El Capitan.

1. Uninstall Soundflower following [this instructions](https://support.shinywhitebox.com/hc/en-us/articles/202751790-Uninstalling-Soundflower).
2. Download and install [Soundflower v2.0b2](https://github.com/mattingalls/Soundflower/releases/download/2.0b2/Soundflower-2.0b2.dmg).

Don't forget rebooting your computer between both steps.

## Development
- This app has dependencies that only work on NodeJS v0.10 (.38 and over), and uses [Electron](http://electron.atom.io/).
- To package the app, use [electron-packager](https://github.com/maxogden/electron-packager) `./build_app.sh`

It has the ability to:
* Scan the network for available UPNP devices, currently only supporting [Jongo S3X](http://www.pure.com/wireless-speakers/jongo-s3x/graphite) and [Jongo TX4](http://www.pure.com/wireless-speakers/jongo-t4x/graphite) speakers.
* Scan the network for available Chromecasts (Both HDMI & Audio)
* Redirect internal Mac OSX sound through Soundflower to create a reliable stream of sound
* Direct this Stream over UPNP to the Jongo speakers

#### Known Issues

* Only casts to UPNP device **at present** - and only tested on a Jongo SX3 and Jongo TX4 speaker.
* Application sometimes does not always kill the stream.
* If the application crashes and on re-start you get a error similar to `listen EADDRINUSE`.
 * You need to find the orphaned process and kill is, use the following to identify the process.
````sh
lsof -i :3000
````
* If `npm install` fails with `Failed at the osx-audio@0.2.0 install script 'node-gyp rebuild'. Try to:
 * `rm -fr node_modules`
 * Manually install `npm install webcast-osx-audio -save` and re-run.

#### Release Notes
* [2016-02-16] - `v0.1.0` - initial release - basic support for redirection of Mac OSX Audio to UPNP Jongo speaker

#### TODO
_v0.2.0_
* Look at adjusting stream quality
* Enable logging to file - remove console.log()

_v0.3.0_
* Ability to control volume of UPNP
* Move to using webcast-osx programmatically and not using exec

_0.4.0_
* Allow casting to Chromecast
* Allow casting to Chromecast Audio with control over pairing/grouping
* Ability to control volume of Chromecast

_Future_
* Build & release installer or similar
* Allow casting to Sonos speakers
* Allow casting to Ruko
* Fix issues when stop/start of audio stream process
* Icons for all types
* Web Site

