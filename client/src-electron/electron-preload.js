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
// import app from "@electron/remote";
import { print, getPrinters } from "unix-print";

const path = require("path");
const fs = require("fs");

// async function createPdfStruk() {
//   const pageWidth = 500,
//     pageHeight = 283;
//   const margin = 30;

//   // Request a canvas from the main process.
//   const canvas = await ipcRenderer.invoke(
//     "create-canvas",
//     pageWidth,
//     pageHeight
//   );
//   const ctx = canvas.getContext("2d");

//   // Set the background color to white.
//   ctx.fillStyle = "#ffffff";
//   ctx.fillRect(0, 0, pageWidth, pageHeight);

//   // Draw the company name centered at the top.
//   const namaPerusahaan = "Nama Perusahaan";
//   ctx.font = "12px Helvetica";
//   let textWidth = ctx.measureText(namaPerusahaan).width;
//   ctx.fillText(namaPerusahaan, (pageWidth - textWidth) / 2, margin);

//   // Simulate the drawing of other elements (you will need to replace with your data).
//   const kodePintuMasuk = "12345";
//   const waktu = new Date().toLocaleTimeString();

//   ctx.fillText("Kode Pintu Masuk", margin, 60);
//   ctx.fillText(": " + kodePintuMasuk, 200, 60); // Replace 200 with actual calculated x position

//   ctx.fillText("Waktu", margin, 90);
//   ctx.fillText(": " + waktu, 200, 90); // Replace 200 with actual calculated x position

//   // Convert the canvas to a Buffer containing the PDF data.
//   const pdfBuffer = await ipcRenderer.invoke("canvas-to-pdf", canvas);

//   // Save the PDF to the file system.
//   const outputFilePath = path.resolve(
//     __dirname,
//     process.env.QUASAR_PUBLIC_FOLDER,
//     "struk/struk.pdf"
//   );

//   fs.writeFileSync(outputFilePath, pdfBuffer);
//   console.log("The PDF file was created.");
// }

// import { writeFileSync } from "fs";
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
    path.resolve(
      __dirname,
      process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
    )
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
    // printStruk();
    log("PDF created successfully");
    // Here you can perform post-creation operations like opening the PDF or displaying a message
  });
};

async function printStruk() {
  // createPdfStruk();

  const outputFilePath = path.resolve(
    __dirname,
    process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
  );

  console.log(outputFilePath);
  fs.access(outputFilePath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.error("Struk file does not exist:", outputFilePath);
      return;
    }

    await print(outputFilePath)
      .then(() => {
        console.log("Printing done");
      })
      .catch(console.error);
  });
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
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
