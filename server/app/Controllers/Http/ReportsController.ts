import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ReportsController {
  public async kunjungan({ response }: HttpContextContract) {
    const currentDate = new Date();

    // Get the total number of visits
    const totalKunjungan = await Database.from("transaksi_penjualan")
      .countDistinct("id_transaksi as total")
      .then((result) => result[0].total);

    // Get the number of visits per day
    const kunjunganPerHari = await Database.from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [
        `${currentDate.toISOString().split("T")[0].replace(/-/g, "/")}/%`,
      ])
      .countDistinct("no_transaksi as total")
      .then((result) => result[0].total);

    // Get the number of visits per month
    const yearMonth = currentDate
      .toISOString()
      .split("T")[0]
      .slice(0, 7)
      .replace(/-/g, "/");
    const kunjunganPerBulan = await Database.from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [`${yearMonth}/%`])
      .countDistinct("no_transaksi as total")
      .then((result) => result[0].total);

    response.status(200).json({
      totalKunjungan,
      kunjunganPerHari,
      kunjunganPerBulan,
    });
  }

  public async dataTransaksiPerTanggal({
    request,
    response,
  }: HttpContextContract) {
    const { startDate, endDate, lastId, page, perPage, status } =
      request.body();
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const startDateFormatted = startDate
      ? startDate
      : today.toISOString().split("T")[0].replace(/-/g, "/");
    const endDateFormatted = endDate
      ? endDate
      : today.toISOString().split("T")[0].replace(/-/g, "/");

    const pageNumber = page || 1;
    const limit = perPage || 10; // Default to 10 items per page if not specified

    const query = Database.from("transaksi_parkir")
      .select(
        "id",
        "no_pol",
        "waktu_masuk",
        "waktu_keluar",
        "pic_body_masuk",
        "pic_body_keluar",
        "bayar_keluar",
        "status_transaksi",
        "status"
      )
      .whereBetween(
        Database.raw(
          "TO_DATE(substring(CAST(waktu_keluar AS text) from 1 for 10), 'YYYY-MM-DD')"
        ),
        [startDateFormatted, endDateFormatted]
      )
      .orderBy("id", "asc");

    if (lastId) {
      query.andWhere("id", ">", lastId);
    }

    if (status !== null) {
      query.andWhere("status", "=", status);
    }
    const dataTransaksi = await query.paginate(pageNumber, limit);

    // const totalBayarKeluar = dataTransaksi
    //   .toJSON()
    //   .data.reduce((acc, item) => acc + (item.bayar_keluar || 0), 0);

    const [totalBayarKeluar] = await Database.from("transaksi_parkir")
      .whereBetween(
        Database.raw(
          "TO_DATE(substring(CAST(waktu_keluar AS text) from 1 for 10), 'YYYY-MM-DD')"
        ),
        [startDateFormatted, endDateFormatted]
      )
      .sum("bayar_keluar as total");

    // Encode images outside of the database query
    const enhancedData = await Promise.all(
      dataTransaksi.toJSON().data.map(async (item) => {
        const picBodyMasukBase64 = item.pic_body_masuk
          ? Buffer.from(item.pic_body_masuk).toString("base64")
          : null;
        const picBodyKeluarBase64 = item.pic_body_keluar
          ? Buffer.from(item.pic_body_keluar).toString("base64")
          : null;

        return {
          no_pol: item.no_pol,
          waktu_masuk: item.waktu_masuk,
          waktu_keluar: item.waktu_keluar,
          bayar_keluar: item.bayar_keluar,
          status_transaksi: item.status_transaksi,
          status: item.status,
          pic_body_masuk_base64: picBodyMasukBase64,
          pic_body_keluar_base64: picBodyKeluarBase64,
        };
      })
    );

    response.status(200).json({
      dataTransaksi: enhancedData,
      totalBayarKeluar, // Total bayar keluar dihitung dari hasil query
      meta: dataTransaksi.toJSON().meta, // Menyertakan metadata pagination
    });
  }

  public async getTransactionImage({ request, response }: HttpContextContract) {
    const transactionId = request.param("id");
    const transaction = await Database.from("transaksi_parkir")
      .where("id", transactionId)
      .select("pic_body_masuk", "pic_body_keluar")
      .first();

    if (!transaction) {
      return response.status(404).json({ message: "Transaction not found" });
    }

    // Mengembalikan gambar dalam format base64
    const picBodyMasukBase64 = transaction.pic_body_masuk
      ? Buffer.from(transaction.pic_body_masuk).toString("base64")
      : null;
    const picBodyKeluarBase64 = transaction.pic_body_keluar
      ? Buffer.from(transaction.pic_body_keluar).toString("base64")
      : null;

    if (picBodyMasukBase64) {
      console.log(
        `Ukuran gambar masuk (base64): ${picBodyMasukBase64.length} karakter`
      );
    }
    if (picBodyKeluarBase64) {
      console.log(
        `Ukuran gambar keluar (base64): ${picBodyKeluarBase64.length} karakter`
      );
    }
    response.status(200).json({
      picBodyMasukBase64,
      picBodyKeluarBase64,
    });
  }

  public async pendapatan({ request, response }: HttpContextContract) {
    const { startDate: startDateParam, endDate: endDateParam } = request.body();
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const startDate = startDateParam
      ? startDateParam
      : today.toISOString().split("T")[0].replace(/-/g, "/");
    const endDate = endDateParam
      ? endDateParam
      : today.toISOString().split("T")[0].replace(/-/g, "/");

    const currentDate = new Date();
    // const yearMonthDay = currentDate.toISOString().split("T")[0];
    // const yearMonth = yearMonthDay.slice(0, 7);

    // Get the total revenue
    const totalPendapatan = await Database.from("transaksi_penjualan")
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    // Get the revenue per day
    const pendapatanPerHari = await Database.from("transaksi_penjualan")
      .whereBetween(Database.raw("CAST(substr(no_transaksi, 1, 10) AS DATE)"), [
        startDate,
        endDate,
      ])
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    const detailPendapatanPerHari = await Database.from("transaksi_penjualan")
      .select(
        Database.raw("CAST(substr(no_transaksi, 1, 10) AS DATE) as tanggal")
      )
      .sum("total_bayar as total")
      .whereBetween(Database.raw("CAST(substr(no_transaksi, 1, 10) AS DATE)"), [
        startDate,
        endDate,
      ])
      .groupBy("tanggal")
      .orderBy("tanggal", "asc")
      .then((result) => result || []);

    // Refactor to use query builder instead of raw query for better readability and maintainability
    const pendapatanPerBulan = await Database.from("transaksi_penjualan")
      .whereRaw(
        "EXTRACT(YEAR FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ? AND EXTRACT(MONTH FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ?",
        [currentDate.getFullYear(), currentDate.getMonth() + 1]
      )
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    response.status(200).json({
      totalPendapatan,
      pendapatanPerHari,
      detailPendapatanPerHari,
      pendapatanPerBulan,
    });
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
