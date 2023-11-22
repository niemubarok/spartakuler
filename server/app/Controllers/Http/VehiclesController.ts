import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class VehiclesController {
  public async index({ response }: HttpContextContract) {
    const vehicles = await Database.query() // 👈 gives an instance of select query builder
      .from("jenis_mobil")
      .select("*");
    response.status(200).json(vehicles);
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
