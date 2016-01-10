## DeviceCast

Based on the work done by https://github.com/andresgottlieb/soundcast with help from some handy libraries such as:
 * TODO

Primarily driven by the need to stream all audio from my Mac Book to a set of recently purchased Jongo speakers.
After having issues with bluetooth connectivity and problems with the range bluetooth covers, this applications aims to eliminate this
restriction by using UPNP over WIFI for better performance, namely distance.

It has the ability to:
* Scan the network for available UPNP devices, currently only supporting Jongo S3 and Jongo S4 speakers.
* Scan the network for available Chromecasts (Both HDMI & Audio)
* Redirect internal mac osx sound through Soundflower to create a reliable stream of sound
* Direct this Stream over UPNP to the Jongo speakers

### Installation

1. Download and install [Soundflower v2.0b2](https://github.com/mattingalls/Soundflower/releases/download/2.0b2/Soundflower-2.0b2.dmg) (if you have a previous version, follow [this instructions](https://support.shinywhitebox.com/hc/en-us/articles/202751790-Uninstalling-Soundflower) to uninstall it and then install v2.0b2).
2. checkout & build `npm install && ./build_app.sh`
3. If you want it to start automatically with your computer do [this](http://www.howtogeek.com/206178/mac-os-x-change-which-apps-start-automatically-at-login/).

## Mac OS X El Capitan

Soundflower to v2.0b2 is required for El Capitan.

1. Uninstall Soundflower following [this instructions](https://support.shinywhitebox.com/hc/en-us/articles/202751790-Uninstalling-Soundflower).
2. Download and install [Soundflower v2.0b2](https://github.com/mattingalls/Soundflower/releases/download/2.0b2/Soundflower-2.0b2.dmg).

Don't forget rebooting your computer between both steps.

## Development
- This app has dependencies that only work on NodeJS v0.10 (.38 and over), and uses [Electron](http://electron.atom.io/).
- To package the app, use [electron-packager](https://github.com/maxogden/electron-packager):

#### Known Issues

* If the application crashes and on re-start you get a error similar to `listen EADDRINUSE`.
 * You need to find the orphaned process and kill is, use the following to identify the process.
````sh
lsof -i :3000
````

#### Release Notes
* [2016-01-16] - initial release - basic support for redirection of Mac OSX Audio to UPNP Jongo speaker

#### TODO
* README
* Add links to all librires soundflower etc
* Original author mentions/references
* Move all logos to /assets
* clean up package.json
* Ruko Support
