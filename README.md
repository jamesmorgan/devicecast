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

![0.3.0 Device Menu](/screenshots/screenshot-v0.3.0-device-menu.png "0.3.0 Device Menu")
![0.3.0 Stream Menu](/screenshots/screenshot-v0.3.0-stream-menu.png "0.3.0 Stream Menu")

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

## Tested On
| Device  | Outcome |
| ------- | ------- |
| Jongo SX3  | PASS |
| Jongo TX4  | PASS |
| Jongo TX6  | PASS |
| Chromecast Audio  | TODO |
| Chromecast | TODO |
| Sonos | TODO |

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
* [2016-01-08] - `0.1.0`
 * initial release - basic support for redirection of Mac OSX Audio to UPNP Jongo speaker

* [2016-01-13] - `_0.2.0_`
 * Look at adjusting stream quality - providing options
 * Allow start/stop of casting & switching to other devices once stopped
 * Notifications on start/stop streaming

* [2016-01-27] - `_0.3.0_`
* Enable logging to file - remove console.log()
* Verbose mode - enabled logging of unknown devices e.g. logging of device
* Allow streaming over microphone over speakers (very doable but is a required feature?)

* [2016-XX-XX] - `_0.4.0_`
* Allow casting to Chromecast
* Allow casting to Chromecast Audio

#### TODO

_Future_
* Allow general discovery mode where every device is logged out e.g. [-d]
* Ability to 'Refresh Devices'
* Allow casting to Sonos speakers - https://github.com/bencevans/node-sonos
* Allow casting to Ruko - https://github.com/TheThingSystem/node-roku
* Ability to control Chromecast Audio pairing/grouping
* Ability to control volume of Chromecast
* Ability to control volume of UPNP Device
* Build & release installer or similar
* Icons for all types
* Web Site
* config store - http://stackoverflow.com/questions/30465034/where-to-store-user-settings-in-electron-atom-shell-application

_BLOCKED_
* Set icon device when playing - see: https://github.com/atom/electron/issues/528
* Move to using webcast-osx programmatically and not using exec - Note possible at present - due to restrictions in webcast-osx-audio
* Upgrade to latest node - see: https://github.com/fardog/node-osx-audio/issues/7
§
