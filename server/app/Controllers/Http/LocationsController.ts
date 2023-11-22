import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class LocationsController {
  public async index({ response }: HttpContextContract) {
    const locations = await Database.query() // 👈 gives an instance of select query builder
      .from("nama_pos")
      .select(["id", "nama", "jenis"]);
    response.status(200).json(locations);
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
