import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import sharp from "sharp";

export default class TransactionsController {
  private formatLocalDateTime(date: Date): string {
    return (
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2) +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2) +
      "." +
      (date.getMilliseconds() + "000").slice(0, 3)
    );
  }

  private async compressImageAndConvertToBase64(
    imageBuffer: Buffer
  ): Promise<string | null> {
    // Pengecekan apakah imageBuffer ada dan merupakan instance dari Buffer
    if (!imageBuffer) {
      return null;
    }

    try {
      // Check if input is already base64
      const isBase64 = imageBuffer.toString().match(/^data:image\/[a-z]+;base64,/);
      if (isBase64) {
      // If it's base64, decode first, then compress
      const actualData = imageBuffer.toString().split(',')[1];
      const imgBuffer = Buffer.from(actualData, 'base64');
      const compressedImage = await sharp(imgBuffer)
        .resize(512)
        .jpeg({ quality: 80 })
        .toBuffer();
      return `data:image/jpeg;base64,${compressedImage.toString('base64')}`;
      }

      // If not base64, compress directly
      const compressedImage = await sharp(imageBuffer)
      .resize(512)
      .jpeg({ quality: 80 })
      .toBuffer();

      return compressedImage.toString("base64");
    } catch (error) {
      console.error("Error compressing image:", error);
      return null;
    }
  }

  public async index({}: HttpContextContract) {
    // const transactions = await Database.query() // 👈 gives an instance of select query builder
    //   .from("transaksi_parkir")
    //   .select("*");
    const transactions = await Database.rawQuery(
      "SELECT no_pol, pic_body_masuk FROM transaksi_parkir WHERE EXTRACT(MONTH from waktu_masuk) = 12 LIMIT 10"
    );
    return transactions;
  }

  public async create({ request }: HttpContextContract) {
    const requestBody = request.body();

    const dataToStore = {
      id: requestBody.id,
      no_pol: requestBody.no_pol,
      id_kendaraan: requestBody.id_kendaraan,
      status: requestBody.status,
      id_pintu_masuk: requestBody.id_pintu_masuk || null,
      id_pintu_keluar: requestBody.id_pintu_keluar,
      waktu_masuk: requestBody.waktu_masuk,
      waktu_keluar: requestBody.waktu_keluar,
      id_op_masuk: requestBody.id_op_masuk || null,
      id_op_keluar: requestBody.id_op_keluar,
      id_shift_masuk: requestBody.id_shift_masuk || null,
      id_shift_keluar: requestBody.id_shift_keluar,
      kategori: requestBody.kategori || null,
      status_transaksi: requestBody.status_transaksi,
      bayar_masuk: requestBody.bayar_masuk || null,
      bayar_keluar: requestBody.bayar_keluar,
      jenis_system: requestBody.jenis_system || null,
      tanggal: requestBody.tanggal,
      pic_body_masuk: requestBody.pic_body_masuk || null,
      pic_body_keluar: requestBody.pic_body_keluar,
      pic_driver_masuk: requestBody.pic_driver_masuk || null,
      pic_driver_keluar: requestBody.pic_driver_keluar || null,
      pic_no_pol_masuk: requestBody.pic_no_pol_masuk || null,
      pic_no_pol_keluar: requestBody.pic_no_pol_keluar || null,
      sinkron: requestBody.sinkron,
      adm: requestBody.adm || null,
      alasan: requestBody.alasan || null,
      pmlogin: requestBody.pmlogin || null,
      pklogin: requestBody.pklogin,
      upload: requestBody.upload,
      manual: requestBody.manual,
      veri_kode: requestBody.veri_kode || null,
      veri_check: requestBody.veri_check || null,
      veri_adm: requestBody.veri_adm || null,
      veri_date: requestBody.veri_date || null,
      denda: requestBody.denda || null,
      extra_bayar: requestBody.extra_bayar || null,
      no_barcode: requestBody.no_barcode || null,
      jenis_langganan: requestBody.jenis_langganan || null,
      post_pay: requestBody.post_pay,
      reff_kode: requestBody.reff_kode,
      valet_adm: requestBody.valet_adm || null,
      waktu_valet: requestBody.waktu_valet || null,
      valet_charge: requestBody.valet_charge || null,
      valet_ops: requestBody.valet_ops || null,
      valet_nopol: requestBody.valet_nopol || null,
      login_waktu_valet: requestBody.login_waktu_valet || null,
      cara_bayar: requestBody.cara_bayar || null,
      unit_member: requestBody.unit_member || null,
      reserved: requestBody.reserved,
      no_voucher: requestBody.no_voucher || null,
      seri_voucher: requestBody.seri_voucher || null,
      no_access_in: requestBody.no_access_in || null,
      no_access_out: requestBody.no_access_out || null,
      inap: requestBody.inap || null,
      casual_denda: requestBody.casual_denda || null,
    };

    // return dataToStore;

    const insertQuery = `
      INSERT INTO transaksi_parkir (
        ${Object.keys(dataToStore).join(", ")}
      ) VALUES (
        ${Object.values(dataToStore)
          .map((value) => (value === null ? "NULL" : `'${value}'`))
          .join(", ")}
      )`;

    const store = await Database.rawQuery(insertQuery);

    return store;
  }

  public async store({}: HttpContextContract) {}

  public async getDataByNopol({ request, response }: HttpContextContract) {
    const { no_pol } = request.body();
    const transaction = await Database.rawQuery(
      `SELECT no_pol, waktu_masuk, pic_body_masuk, pic_body_keluar, pic_driver_masuk,status, id_pintu_masuk, waktu_masuk FROM transaksi_parkir WHERE LOWER(no_pol) = LOWER('${no_pol}') Limit 1`
    );

    // return transaction.rows;
    response.status(200).json(transaction.rows);
  }
  public async checkTransaction({ request, response }: HttpContextContract) {
    const { no_pol } = request.body();

    const [transaction] = await Database.query()
      .from("transaksi_parkir")
      .select("count(no_pol)")
      .where("no_pol", no_pol)
      .where("status", 1)
      .limit(1);

    response.status(200).json({ count: transaction.count });
  }
  public async getPicture({ request }: HttpContextContract) {
    const no_pol = request.body().no_pol;
    const pic = await Database.rawQuery(
      `SELECT pic_body_masuk FROM transaksi_parkir WHERE  LOWER(no_pol) = LOWER('${no_pol}')`
    );

    // return pic.rows[0].pic_body_masuk.toString();
    // let picBodyMasukBase64;
    // console.log(pic.rows[0]);
    return pic.rows[0].pic_body_masuk;

    if (pic.rows && pic.rows.length > 0) {
      const binaryData = pic.rows[0].pic_body_masuk;
      if (!binaryData?.toString().startsWith("data:image")) {
        return binaryData.toString("base64");
      } else {
        return pic.rows[0].pic_body_masuk;
      }
    }

    // const picBodyMasuk = pic.rows[0].pic_body_masuk;
    // return picBodyMasuk;
    // response.send(picBodyMasuk);
  }

  public async update({ request, response }: HttpContextContract) {
    const requestBody = request.body().formData;

    const {
      nomorTiket,
      no_pol,
      id_kendaraan,
      status,
      id_op_keluar,
      id_shift_keluar,
      status_transaksi,
      bayar_keluar,
      pic_body_keluar,
      pklogin,
      no_barcode,
    } = requestBody;

    const formData = {
      no_pol,
      id_kendaraan,
      status,
      id_op_keluar,
      id_shift_keluar,
      status_transaksi,
      bayar_keluar,
      pic_body_keluar,
      pklogin,
      no_barcode,
    };

    try {
      const compressedBase64 = await this.compressImageAndConvertToBase64(
        Buffer.from(formData.pic_body_keluar, "base64")
      );

      const updateQuery = `
        UPDATE transaksi_parkir
        SET
          no_pol = '${formData.no_pol}',
          id_kendaraan = '${formData.id_kendaraan}',
          status = '${formData.status}',
          waktu_keluar = '${this.formatLocalDateTime(new Date())}',
          id_op_keluar = '${formData.id_op_keluar}',
          id_shift_keluar = '${formData.id_shift_keluar}',
          status_transaksi = '${formData.status_transaksi}',
          bayar_keluar = '${formData.bayar_keluar}',
          tanggal = '${this.formatLocalDateTime(new Date())}',
          pic_body_keluar = ${
            compressedBase64
              ? `decode('${compressedBase64}', 'base64')`
              : "NULL"
          },
          pklogin = '${formData.pklogin}',
          no_barcode = '${formData.no_barcode}'
        WHERE LOWER (no_pol) = LOWER ('${nomorTiket}');
      `;

      const update = await Database.rawQuery(updateQuery);
      console.log(update.rowCount);

      if (update.rowCount > 0) {
        response.status(200).json({
          message: "Update successful",
        });
      } else {
        response.status(304).json({
          message: "Update failed",
        });
      }
    } catch (error) {
      console.log(error);
      response.status(304).json({
        message: "Update failed",
      });
    }
  }

  public async countVehicleInToday({}: HttpContextContract) {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const count = await Database.rawQuery(
      `SELECT count(no_pol) FROM transaksi_parkir WHERE EXTRACT(DAY FROM waktu_masuk) = '${date}' AND EXTRACT(MONTH FROM Waktu_masuk) = '${month}' AND EXTRACT(YEAR FROM Waktu_masuk) =  '${year}'`
    );
    // return today;

    return count.rows[0];
  }

  public async countVehicleOutToday({ request }: HttpContextContract) {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const shift_id = request.body().shift_id;

    const count = await Database.rawQuery(
      `SELECT jenis_mobil.nama, COUNT(*) as count, SUM(transaksi_parkir.bayar_keluar) as uang_masuk
      FROM transaksi_parkir
      INNER JOIN jenis_mobil ON transaksi_parkir.id_kendaraan = jenis_mobil.id
      WHERE transaksi_parkir.id_shift_keluar = '${shift_id}' AND EXTRACT(DAY FROM transaksi_parkir.waktu_keluar) = '${date}' AND EXTRACT(MONTH FROM transaksi_parkir.Waktu_keluar) = '${month}' AND EXTRACT(YEAR FROM transaksi_parkir.Waktu_keluar) = '${year}' AND transaksi_parkir.status = '0'
      GROUP BY jenis_mobil.nama`
    );

    return count.rows;
  }

  public async countVehicleInside({}: HttpContextContract) {
    const count = await Database.rawQuery(
      `SELECT count(no_pol) FROM transaksi_parkir WHERE status = '1'`
    );

    return count.rows[0];
  }

  public async manualOpenGate({ request, response }: HttpContextContract) {
    const { petugas, id_shift, id_pos, pic } = request.body();
    const tanggal = new Date().toISOString();

    try {
      const insert = await Database.rawQuery(
        `INSERT INTO manualbot (petugas, id_shift, id_pos,tanggal, pic) VALUES ('${petugas}','${id_shift}','${id_pos}','${tanggal}','${pic}')`
      );

      if (insert) {
        response.status(200).json({
          message: "Insert successful",
        });
      }
    } catch (error) {
      return error;
    }
  }

  public async saveDataToStore({ request, response }: HttpContextContract) {
    try {
      const data = request.body();

      // Insert data into the transaksi_parkir table
      await Database.table('transaksi_parkir').insert({
        detected_plates: JSON.stringify(data.detected_plates),
        plate_image: data.plate_image,
        driver_image: data.driver_image,
        timestamp: data.timestamp,
        gate_status: data.gate_status,
        location: data.location,
        confidence_threshold_met: data.confidence_threshold_met,
        processing_time: data.processing_time,
        operator: data.operator,
      });

      response.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      response.status(500).json({ message: 'Failed to save data', error });
    }
  }
}
