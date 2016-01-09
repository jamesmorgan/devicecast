#!/usr/bin/env bash

electron-packager . dlnacast --platform=darwin --arch=x64 --version=0.36.0 --icon=./assets/icon.icns --overwrite --enable-logging
