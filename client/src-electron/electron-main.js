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
    
    maximizable: false,
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

    // mainWindow.setMenu(null);
    // mainWindow.setMenuBarVisibility(false); 

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

ipcMain.on('print-struk', (event, data) => {
  const html = getStrukHTML(data)

  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true }
  })

  printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({
      silent: true,
      printBackground: true,
      deviceName: 'EPSON TM-T82' // ganti nama printer kamu
    }, (success, err) => {
      if (!success) console.log('Print failed:', err)
      printWindow.close()
    })
  })
})

function getStrukHTML(data) {
  return `
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><style>
    body { font-family: 'Courier New'; font-size: 12px; width: 250px; padding: 10px; }
    .center { text-align: center; } .bold { font-weight: bold; } .line { border-top: 1px dashed black; margin: 5px 0; }
    .row { display: flex; justify-content: space-between; }
    </style></head><body>
    <div class="center bold">PARKIR OTOMATIS<br>PT. SINERGI INFORMATIKA</div>
    <div class="line"></div>
    <div class="row"><div>No Tiket</div><div>${data.ticketNo}</div></div>
    <div class="row"><div>Tanggal</div><div>${data.date}</div></div>
    <div class="row"><div>Jam Masuk</div><div>${data.time}</div></div>
    <div class="row"><div>Plat</div><div>${data.plate}</div></div>
    <div class="row"><div>Jenis</div><div>${data.type}</div></div>
    <div class="line"></div>
    <div class="center">Silakan simpan tiket ini<br>Untuk keluar parkir</div>
    <div class="center" style="margin-top: 10px;">Terima Kasih</div>
    </body></html>
  `
}


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
