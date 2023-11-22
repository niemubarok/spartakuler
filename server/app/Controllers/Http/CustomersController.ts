import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class CustomersController {
  public async getCustomerByNopol({ request, response }: HttpContextContract) {
    const no_pol = request.body().no_pol;
    // return no_pol;
    // console.log(no_pol);
    try {
      const cust = await Database.rawQuery(
        "SELECT detail_transaksi_stiker.notrans, detail_transaksi_stiker.nopol, detail_transaksi_stiker.jenis_mobil as id_jenis_kendaraan, detail_transaksi_stiker.jenis_member, transaksi_stiker.*, jenis_mobil.nama as jenis_kendaraan FROM detail_transaksi_stiker INNER JOIN transaksi_stiker ON transaksi_stiker.notrans = detail_transaksi_stiker.notrans INNER JOIN jenis_mobil ON jenis_mobil.id = detail_transaksi_stiker.jenis_mobil WHERE detail_transaksi_stiker.nopol = :no_pol",
        {
          no_pol,
        }
      );
      response.status(200).json(cust.rows[0]);
    } catch (error) {
      return error;
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
