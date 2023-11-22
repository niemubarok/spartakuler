/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { contextBridge } from "electron";
import { SerialPort } from "serialport";

// function getDeviceDetails(device) {
//   return device.productName || `Unknown device ${device.deviceId}`;
// }
function createSerialPort(portName) {
  const instance = new SerialPort({
    path: portName,
    baudRate: 9600,
    autoOpen: false,
  });
  const open = async () => {
    instance.open();
  };

  const write = async (data) => {
    // instance.open();
    instance.write(data);
    // instance.close();
  };

  const data = instance.on("data", (data) => {
    return data;
  });

  const close = async () => {
    instance.close();
  };
  return { instance, write, close, open, data };
}

// function getSerialPortList() {
//   return SerialPort.list();
// }

contextBridge.exposeInMainWorld("electron", {
  serialport: createSerialPort,
  // getSerialPortList: getSerialPortList,
});
