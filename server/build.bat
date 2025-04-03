@echo off
REM Build the AdonisJS project
@REM node ace build --production

REM Create dist directory if not exists
if not exist "dist" mkdir dist

REM Package with pkg
pkg ./build/server.js --config pkg.config.json -o dist/spartakuler.exe

REM Copy .env file
copy .env dist\.env

REM Install fs-extra if not already installed
@REM npm install fs-extra --save-dev

REM Copy Sharp files
@REM node copy-sharp-files.js