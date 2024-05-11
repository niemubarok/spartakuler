import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import fs from "fs";

import { spawn } from "child_process";

function determineMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    jpg: "jpeg",
    jpeg: "jpeg",
    png: "png",
    gif: "gif",
    bmp: "bmp",
  };

  return `image/${mimeTypes[extension.toLowerCase()] || "jpeg"}`;
}

export default class ImagesController {
  public async downloadImage(fileName: string, url: string) {
    const dirPath =
      process.platform === "win32"
        ? `${process.env.USERPROFILE || process.env.HOME}\\cctv_images`
        : `${process.env.HOME || process.env.USERPROFILE}/cctv_images`;
    const filePath = `${dirPath}${
      process.platform === "win32" ? "\\" : "/"
    }${fileName}`;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    if (
      !url ||
      url.trim() === "" ||
      url === "null" ||
      url === "undefined" ||
      url === "-"
    ) {
      return false;
    } else {
      try {
        const curlProcess = spawn("curl", [url, "-o", filePath]);
        let result: "success" | "failed" = "failed";
        curlProcess.on("exit", (code) => {
          if (code === 0) {
            result = "success";
          }
        });
        await new Promise<void>((resolve) => {
          curlProcess.on("close", resolve);
        });
        return result;
      } catch (error) {
        // console.error(`Error downloading image: ${error.message}`);
        return "failed";
      }
    }
  }
  public async index({ request, response }: HttpContextContract) {
    const loadImageFromDisk = async () => {
      const dirPath =
        process.platform === "win32"
          ? `${process.env.USERPROFILE || process.env.HOME}\\cctv_images`
          : `${process.env.HOME || process.env.USERPROFILE}/cctv_images`;
      // const fileName = "02_out_snapshot";
      const fileName = `${request.qs().fileName.trim()}`;

      // Mencari file dengan ekstensi yang sesuai menggunakan regex
      const files = fs.readdirSync(dirPath);
      const regex = new RegExp(`^${fileName}.*`, "i"); // Regex untuk mencocokkan nama file diawali dengan fileName dan diikuti oleh karakter apapun
      const foundFile = files.find((file) => regex.test(file));

      if (!foundFile) {
        // console.error(`No file found starting with name: ${fileName}`);
        return response.status(200).json({
          isSuccess: false,
          message: "File tidak ditemukan",
        });
      }

      const filePath = `${dirPath}${
        process.platform === "win32" ? "\\" : "/"
      }${foundFile}`;

      // console.log(`Attempting to load image from: ${filePath}`);

      try {
        const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              console.error(
                `Error reading file from path ${filePath}: ${err.message}`
              );
              reject(err);
            } else {
              if (data.length === 0) {
                // console.error(`File at path ${filePath} is empty.`);
                reject(new Error("File is empty"));
              } else {
                // console.log(`File read successfully from path ${filePath}`);
                resolve(data);
              }
            }
          });
        });

        const ext = foundFile.split(".").pop() || "jpg"; // Menggunakan ekstensi dari file yang ditemukan
        const base64Image = imageBuffer.toString("base64");
        const mimeType = determineMimeType(ext);

        return response.status(200).json({
          isSuccess: true,
          base64: `data:${mimeType};base64,${base64Image}`,
        });
      } catch (error) {
        console.error(`Failed to process image: ${error.message}`);
        return response.status(200).json({
          isSuccess: false,
          message: "Gambar tidak ditemukan",
        });
      }
    };
    const fileName = request.qs().fileName as string;
    const cctvUrl = request.qs().cctv_url as string;

    if (!fileName) {
      return response.status(400).json({
        isSuccess: false,
        message: "Mohon sertakan parameter fileName",
      });
    }

    if (!cctvUrl) {
      // console.log("Tidak ada URL");
      return response
        .status(400)
        .json({ isSuccess: false, message: "URL tidak ditemukan" });
    }

    const isDownloaded = await this.downloadImage(fileName, cctvUrl);
    // console.log(typeof isDownloaded);

    if (isDownloaded === false) {
      // console.log("tidak ada url");
      // return response.status(200).json({
      //   isSuccess: false,
      //   message: "Tidak ada url",
      // });
      return await loadImageFromDisk();
    }

    if (isDownloaded === "failed") {
      // console.log("Gagal download image");
      return response.status(200).json({
        isSuccess: false,
        message: "Gagal download image",
      });
    }

    // await this.downloadImage(fileName, cctvUrl);

    return await loadImageFromDisk();

    // return response.status(200).json({
    //   isSuccess: true,
    //   base64: `data:image/${ext};base64,${base64Image}`,
    // });
    // } catch (error) {
    //   return response.status(200).json({
    //     isSuccess: false,
    //     message: "Gambar tidak ditemukan",
    //   });
    // }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
// function exec(curlCommand: string, arg1: (error: any) => void) {
//   throw new Error("Function not implemented.");
// }
