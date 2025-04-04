import { ipcMain, app, BrowserWindow, session } from "electron";
import path from "path";
import os from "os";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    // width: 1000,
    // height: 600,
    fullscreen: true,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      sandbox: false,
    },
  });

    // Add CSP headers
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src 'self' http://127.0.0.1:3333 http://localhost:3333 http://localhost:8000 http://127.0.0.1:8000; " +
        "img-src 'self' data: http://127.0.0.1:* http://localhost:*;"
      ]
        }
      })
    })

  
  ipcMain.on("download-pdf", async (event, arrayBuffer, filename) => {
    const directoryPath = path.join(os.homedir(), "struk");
    try {
      const fsp = fs.promises;
      await fsp.mkdir(directoryPath, { recursive: true });
      const filePath = path.join(directoryPath, filename);
      const buffer = Buffer.from(arrayBuffer);
      await fsp.writeFile(filePath, buffer);
      console.log("File written successfully");
    } catch (err) {
      console.log("Error writing file", err);
    }
  });

  // let grantedDeviceThroughPermHandler;
  mainWindow.webPreferences = {
    crossOrigin: "none",
  };

  // mainWindow.webContents.session.on(
  //   "select-usb-device",
  //   (event, details, callback) => {
  //     // Add events to handle devices being added or removed before the callback on
  //     // `select-usb-device` is called.
  //     mainWindow.webContents.session.on("usb-device-added", (event, device) => {
  //       console.log("usb-device-added FIRED WITH", device);
  //       // Optionally update details.deviceList
  //     });

  //     mainWindow.webContents.session.on(
  //       "usb-device-removed",
  //       (event, device) => {
  //         console.log("usb-device-removed FIRED WITH", device);
  //         // Optionally update details.deviceList
  //       }
  //     );

  //     event.preventDefault();
  //     if (details.deviceList && details.deviceList.length > 0) {
  //       const deviceToReturn = details.deviceList.find((device) => {
  //         return (
  //           !grantedDeviceThroughPermHandler ||
  //           device.deviceId !== grantedDeviceThroughPermHandler.deviceId
  //         );
  //       });
  //       if (deviceToReturn) {
  //         callback(deviceToReturn.deviceId);
  //       } else {
  //         callback();
  //       }
  //     }
  //   }
  // );

  // mainWindow.webContents.session.setPermissionCheckHandler(
  //   (webContents, permission, requestingOrigin, details) => {
  //     console.log("permission", permission);
  //     if (permission === "usb" && details.securityOrigin === "file:///") {
  //       return true;
  //     }
  //   }
  // );

  // mainWindow.webContents.session.setDevicePermissionHandler((details) => {
  //   if (details.deviceType === "usb") {
  //     if (!grantedDeviceThroughPermHandler) {
  //       console.log("details", details.device);
  //       grantedDeviceThroughPermHandler = details.device;
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // });

  // mainWindow.webContents.session.setUSBProtectedClassesHandler((details) => {
  //   return details.protectedClasses.filter((usbClass) => {
  //     // Exclude classes except for audio classes
  //     return usbClass.indexOf("audio") === -1;
  //   });
  // });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
