# Hadi.AI GUI

## Quick start

The latest Node 10 LTS and NPM 6+ need to be installed.

Install Ionic and Cordova globally using

```
npm install -g ionic@latest cordova@latest
```

Install the npm packages and run the Electron app

```
git clone https://github.com/thehunckerma/HadiAI-GUI
cd HadiAI-GUI

npm install
npm run electron:dev
```

Now the desktop app and web app are running.

## Live reload for development

### Desktop

```node
npm run electron:dev
```

For debugging the main process you will need to have the Chrome Browser installed.

```node
npm run electron:dev:debug
```

Open Chrome and navigate to chrome://inspect/ and select the Electron remote target that is available to attach the debugger to.

If you require live reloading of the main process debugging session, then it is recommended that you install the Chrome plugin [Node.js V8 --inspector Manager (NiM)](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=en). In the plugin settings, set the host to localhost, the port to 9229 and the app to auto. This will allow you to live reload changes made to the main process (electron.js file).

```node
npm run electron:dev:debug-live
```

### iOS

#### Emulator

```node
npm run emulate:ios-dev
```

#### Device

```node
npm run device:ios-dev
```

### Android

#### Emulator

```node
npm run emulate:android-dev
```

#### Device

```node
npm run device:android-dev
```

## Building on Windows

For building on Windows you will need to install the Nullsoft Scriptable Install System.

You can [download NSIS here](http://nsis.sourceforge.net/Main_Page)

You will need to make sure the NSIS path is added as an environment variable:

```node
setx PATH "%PATH%;C:\Program Files (x86)\NSIS"
```

Or using [point and click](http://nsis.sourceforge.net/Main_Page).

## NPM Script Commands

| Platform/Commands             |                                                                  |
| :---------------------------- | :--------------------------------------------------------------- |
| **Desktop**                   |                                                                  |
| `npm run electron:dev`        | For development using live reload and opens with developer tools |
| `npm run electron:local`      | Build and run on the desktop, no livereload or developer tools   |
| `npm run electron:linux`      | Production build for linux platform. (Requires Linux)            |
| `npm run electron:mac`        | Production build for macOS. (Requires macOS)                     |
| `npm run electron:windows`    | Production build for Windows. (Requires Windows)                 |
| **iOS**                       |                                                                  |
| `npm run emulate:ios-dev`     | For iOS development on the simulator using live reload           |
| `npm run emulate:ios`         | For iOS development on the simulator                             |
| `npm run device:ios-dev`      | For iOS development on an iOS device using live reload           |
| `npm run device:ios`          | For iOS development on an iOS device                             |
| `npm run release:ios`         | Production build for iOS. (Requires XCode on macOS)              |
| **Android**                   |                                                                  |
| `npm run emulate:android-dev` | For Android development on an emulator using live reload         |
| `npm run emulate:android`     | For Android development on an emulator                           |
| `npm run device:android-dev`  | For Android development on an Android device using live reload   |
| `npm run device:android`      | For Android development on an Android device                     |
| **Web Apps and PWA Apps**     |                                                                  |
| `npm run ionic`               | For web and progressive web app development using live reload    |

<!-- ## Publishing your apps

[How to publish an Android App](https://ionicframework.com/docs/publishing/play-store)

[How to publish an iOS App](https://ionicframework.com/docs/publishing/play-store)

[How to publish a macOS and/or Windows App](https://ionicframework.com/docs/publishing/desktop-app)

[How to publish a progressive web app](https://ionicframework.com/docs/publishing/progressive-web-app) -->

<!-- ## Ionic App Flow

When using [Ionic App Flow](https://ionicframework.com/docs/appflow/quickstart/installation) and the `cordova-plugin-ionic` plugin, you may experience the app hanging on start-up whilst developing your apps in live-reload. To prevent this, the app uses a script to disable deploy in the `config.xml` file in development mode. It then then uses a pre-commit hook to enable it when checking into git.

Using the above npm commands will make sure you don't run into issues with Ioinc App Flow. -->

## Credits

This app is using the [Polyonic](https://github.com/maximegris/angular-electron) boilerplate
