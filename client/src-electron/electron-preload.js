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

import { contextBridge, ipcRenderer } from "electron";
import { SerialPort } from "serialport";
import {
  print as printUnix,
  getPrinters as getUnixPrinters,
  getDefaultPrinter as getUnixDefaultPrinter,
} from "unix-print";
import { print as printWindows } from "pdf-to-printer"; // Replace 'windows-print' with the actual package for Windows printing

import {
  getPrinters as getWindowsPrinters,
  getDefaultPrinter as getWindowsDefaultPrinter,
} from "pdf-to-printer";

const fs = require("fs");
const path = require("path");
const os = require("os");
const directoryPath = path.join(os.homedir(), "struk");
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
const filePath = path.join(directoryPath, "struk.pdf");
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import { log } from "console";

const createPDFStruk = (nama_perusahaan, transaksi) => {
  // log(transaksi);
  // return;
  const pageWidth = 200;
  let pageHeight = 150; // Initial height, will adjust based on content
  const margin = 10;
  const doc = new PDFDocument({
    autoFirstPage: false, // We will add pages manually
  });

  // Start a new page and set its width
  doc.addPage({ size: [pageWidth, pageHeight], margin: margin });

  // Keep track of the current Y position on the page
  const stream = fs.createWriteStream(
    filePath
  );

  doc.pipe(stream);
  let yPosition = margin;

  doc.fontSize(8).font("Helvetica");
  const textWidth = doc.widthOfString(nama_perusahaan);

  doc.text(nama_perusahaan, (pageWidth - textWidth) / 2, yPosition);
  yPosition += 10;

  const strukTextWidth = doc.widthOfString("Struk Parkir");
  doc.text("Struk Parkir", (pageWidth - strukTextWidth) / 2, yPosition);
  yPosition += 20;

  const labelWidth = Math.max(
    doc.widthOfString("Plat Nomor"),
    doc.widthOfString("Petugas"),
    doc.widthOfString("Waktu Masuk"),
    doc.widthOfString("Waktu Keluar"),
    doc.widthOfString("Lama Parkir"),
    doc.widthOfString("Biaya Parkir")
  );
  const labelXPosition = margin + labelWidth + 10;

  doc.text("Petugas", margin, yPosition);
  doc.text(
    ": " + transaksi.petugas + " (" + transaksi.idPintuKeluar + ")",
    labelXPosition,
    yPosition
  );
  yPosition += 10;

  doc.text("Plat Nomor", margin, yPosition);
  doc.text(
    ": " + transaksi.platNomor + " (" + transaksi.jnsKendaraan + ")",
    labelXPosition,
    yPosition
  );
  yPosition += 10;

  doc.text("Waktu Masuk", margin, yPosition);
  doc.text(": " + transaksi.waktuMasuk, labelXPosition, yPosition);
  yPosition += 10;

  doc.text("Waktu Keluar", margin, yPosition);
  doc.text(": " + transaksi.waktuKeluar, labelXPosition, yPosition);
  yPosition += 10;

  doc.text("Lama Parkir", margin, yPosition);
  doc.text(": " + transaksi.lamaParkir, labelXPosition, yPosition);
  yPosition += 10;

  doc.text("Biaya Parkir", margin, yPosition);
  doc.text(": " + transaksi.biayaParkir, labelXPosition, yPosition);
  yPosition += 20;

  doc.fontSize(5);
  doc.font("Helvetica-Bold");
  const terimakasihTextWidth = doc.widthOfString(
    "Terima Kasih, Semoga Selamat Sampai Tujuan"
  );
  doc.text(
    "Terima Kasih, Semoga Selamat Sampai Tujuan",
    (pageWidth - terimakasihTextWidth) / 2,
    yPosition
  );
  // yPosition += 10;
  // Add barcode generation and drawing logic here

  // Before finalizing the PDF, adjust the page height according to the content
  pageHeight = yPosition + margin; // Update pageHeight based on content
  doc.page.height = pageHeight; // Apply the new height to the PDF document's page
  doc.end();

  // Create a writable stream to store the PDF data

  // Handle the 'finish' event of the stream to know when the PDF writing is complete
  stream.on("finish", function () {
    printStruk();
    log("PDF created successfully");
    // Here you can perform post-creation operations like opening the PDF or displaying a message
  });
};

async function printStruk(namaPrinter ) {
  const defaultPrinter = process.platform === "win32" ? await getWindowsDefaultPrinter() : await getUnixDefaultPrinter();
  // console.log("defaultPrinter", defaultPrinter.name);
  // console.log("print", namaPrinter);
  // return
  const printerOption = {
    printer: namaPrinter??defaultPrinter.name,
  };

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    const printResult =
      process.platform === "win32"
        ? await printWindows(filePath, printerOption.printer)
        : await printUnix(filePath, printerOption.printer);

    console.log(printResult);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error during printing: ${errorMessage}`);
  }
}

// function getDeviceDetails(device) {
//   return device.productName || `Unknown device ${device.deviceId}`;
// }
// const detectLicensePlateArea = async (imagePath) => {
//   try {
//     const cv = require("@u4/opencv4nodejs");
//     const image = await cv.imreadAsync(imagePath);
//     const grayImage = await image.cvtColorAsync(cv.COLOR_BGR2GRAY);
//     const blurredImage = await grayImage.gaussianBlurAsync(
//       new cv.Size(5, 5),
//       0
//     );
//     const edgeImage = await blurredImage.cannyAsync(100, 200);
//     const contours = await edgeImage.findContoursAsync(
//       cv.RETR_TREE,
//       cv.CHAIN_APPROX_SIMPLE
//     );

//     const possiblePlates = contours.filter((contour) => {
//       const rect = contour.boundingRect();
//       const aspectRatio = rect.width / rect.height;
//       return contour.area() > 1000 && aspectRatio > 1 && aspectRatio < 5;
//     });

//     possiblePlates.forEach((contour) => {
//       const rect = contour.boundingRect();
//       image.drawRectangle(
//         new cv.Rect(rect.x, rect.y, rect.width, rect.height),
//         new cv.Vec(0, 255, 0),
//         2,
//         cv.LINE_8
//       );
//     });

//     // await cv.imwriteAsync("detected_plates.jpg", image);
//     console.log(
//       "License plate areas detected and image saved as detected_plates.jpg"
//     );
//     return image;
//   } catch (error) {
//     console.error("Error detecting license plate area:", error);
//   }
// };


const { spawn } = require('child_process');

// async function downloadImageFromCCTV(url, filename) {
//   try {
//     const curl = spawn('curl', ['-s', '-o', '-', url]);
//     return new Promise((resolve, reject) => {
//       const dataChunks = [];
//       curl.stdout.on('data', (chunk) => {
//         dataChunks.push(chunk);
//       });
//       curl.stderr.on('data', (data) => {
//         console.error(`Error downloading image from ${url}:`, data.toString());
//         reject(data.toString());
//       });

//       curl.on('close', (code) => {
//         if (code !== 0) {
//           reject(`curl exited with code ${code}`);
//         } else {
//           const data = Buffer.concat(dataChunks);
//           const base64Image = data.toString('base64');
//           resolve(`data:image/jpeg;base64,${base64Image}`);
//         }
//       });
//     });
//   } catch (error) {
//     console.error(`Error downloading image from ${url}:`, error);
//     throw error;
//   }
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
  print: printStruk,
  createPDFStruk,
  // downloadImageFromCCTV
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
