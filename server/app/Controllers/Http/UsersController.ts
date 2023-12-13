import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import { determineShift } from "App/utils/time-utils";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await Database.query() // 👈 gives an instance of select query builder
      .from("pegawai")
      .select("*");
    response.status(200).json(users);
  }

  public async login({ request, response }: HttpContextContract) {
    const { username, password, id_pos } = request.body();
    // const password = request.body().password;

    if (!username || !password) {
      response.status(401).json({
        message: "username atau password tidak boleh kosong",
      });
      return;
    }

    try {
      const user = await Database.rawQuery(
        "SELECT nomer, nama,username, password, status, level_pegawai FROM pegawai WHERE username = :username AND password = :password",
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
        const time_login = new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const tanggal = new Date().toISOString();
        const currentHour = new Date().getHours();

        const getShift = await Database.rawQuery(
          `SELECT id FROM shift WHERE (string_to_array(mulai, ':'))[1]::integer >= ${currentHour}`
        );

        const shift = getShift.rows[0].id;
        const res = {
          id_pegawai: user.rows[0].nomer,
          username: user.rows[0].username,
          password: user.rows[0].password,
          nama: user.rows[0].nama,
          status: user.rows[0].status,
          level_pegawai: user.rows[0].level_pegawai,
          time_login,
          tanggal,
          shift,
        };
        // console.log(tanggal);
        // return time_login;

        if (id_pos) {
          const insert = await Database.rawQuery(
            `INSERT INTO login_log (id_petugas, id_shift, time_login, time_logout, tanggal, pos, akses_id, adm) VALUES ('${user.rows[0].nomer}','${shift}','${time_login}','${time_login}','${tanggal}','${id_pos}','','')`
          );
          //   return "return";
          //   if (insert) {
          //     response.status(200).json(res);
          //   }
        }
        // return "res";
        response.status(200).json(res);
      }
    } catch (error) {
      return error;
    }
  }

  public async logOut({ request, response }: HttpContextContract) {
    const { id_petugas, id_shift, pos, time_login, tanggal } = request.body();

    // return request.body();
    const time_logout = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const update = await Database.rawQuery(
      `UPDATE login_log SET time_logout = '${time_logout}' WHERE id_petugas = '${id_petugas}' AND id_shift = '${id_shift}' AND time_login = '${time_login}' AND tanggal = '${tanggal}' AND pos = '${pos}' `
    );
    // const update = await Database.rawQuery(
    //   `SELECT time_logout FROM login_log WHERE id_petugas = '${id_petugas}' AND id_shift = '${id_shift}' AND time_login = '${time_login}' AND tanggal = '${tanggal}' AND pos = '${pos}' `
    // );
    // return update;
    if (update) {
      response.status(200).json({
        message: "Update successful",
      });
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
