import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import jwt from "jsonwebtoken";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await Database.query() // 👈 gives an instance of select query builder
      .from("pegawai")
      .select("*");
    response.status(200).json(users);
  }

  public async login({ request, response }: HttpContextContract) {
    const username = request.body().username;
    const password = request.body().password;

    const user = await Database.rawQuery(
      "SELECT nama,username, password, status, level_pegawai FROM pegawai WHERE username = :username AND password = :password",
      {
        username,
        password,
      }
    );

    if (!user.rows.length) {
      response.status(401).json({
        message: "username atau password salah",
      });
    } else {
      const res = {
        username: user.rows[0].username,
        password: user.rows[0].password,
        nama: user.rows[0].nama,
        status: user.rows[0].status,
        level_pegawai: user.rows[0].level_pegawai,
      };
      response.status(200).json(res);
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
