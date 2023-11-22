import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class PricesController {
  public async index({ response }: HttpContextContract) {
    const prices = await Database.query() // 👈 gives an instance of select query builder
      .from("tarif")
      .select("*");
    response.status(200).json(prices);
  }

  public async tarifPerJenisKendaraan({
    request,
    response,
  }: HttpContextContract) {
    const id = request.body().id_jenis_kendaraan;
    const prices = await Database.query() // 👈 gives an instance of select query builder
      .from("tarif")
      .select("*")
      .where("id_mobil", id);
    response.status(200).json(prices);
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
