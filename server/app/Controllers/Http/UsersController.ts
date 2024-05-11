import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import { determineShift } from "App/utils/time-utils";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await Database.query() // 👈 gives an instance of select query builder
      .from("pegawai")
      .innerJoin("level_user", "pegawai.level_pegawai", "level_user.level_code")
      .select(
        "pegawai.nomer as id_petugas",
        "pegawai.nama",
        "pegawai.telepon as no_hp",
        "pegawai.username",
        "pegawai.password",
        "pegawai.status",
        "level_user.level_name"
      );
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
        // const currentHour = 12;
        const shifts = await Database.query()
          .from("shift")
          .select("id", "mulai");

        // Sort the shifts by their start time
        shifts.sort(
          (a, b) =>
            parseInt(a.mulai.split(":")[0]) - parseInt(b.mulai.split(":")[0])
        );

        let shiftIndex = -1;
        for (let i = 0; i < shifts.length; i++) {
          const startHour = parseInt(shifts[i].mulai.split(":")[0]);
          const endHour =
            i + 1 < shifts.length
              ? parseInt(shifts[i + 1].mulai.split(":")[0])
              : 24; // Assume shifts wrap to the next day

          if (currentHour >= startHour && currentHour < endHour) {
            shiftIndex = i;
            break;
          }
        }

        // If currentHour didn't match any shifts, take the startHour of the first shift
        if (shiftIndex === -1) {
          shiftIndex = shifts.length - 1;
        }

        const shift = shifts[shiftIndex].id;
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
            `INSERT INTO login_log (id_petugas, id_shift, time_login, tanggal, pos, akses_id, adm) VALUES ('${user.rows[0].nomer}','${shift}','${time_login}','${tanggal}','${id_pos}','','')`
          );
          // return "return";
          if (insert) {
            response.status(200).json(res);
          }
        }
        // return "res";
        // response.status(200).json(res);
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
    console.log(update);

    if (update) {
      response.status(200).json({
        message: "Update successful",
      });
    }
  }

  public async create({ request, response }: HttpContextContract) {
    const req = request.body();

    // const lastIdResult = await Database.rawQuery(
    //   "SELECT MAX(id_petugas) AS max_id FROM petugas"
    // );
    // const lastId = lastIdResult.rows[0]?.max_id;
    // console.log("lastId", lastId);

    const newPetugas = await Database.table("pegawai")
      .returning("nomer")
      .insert({
        nomer: req.id_petugas,
        nama: req.nama,
        telepon: req.no_hp,
        username: req.username,
        password: req.password,
        status: parseInt(req.status),
        level_pegawai: req.level_code,
      });

    if (newPetugas) {
      const petugasId = newPetugas[0];
      response.status(201).json({
        message: "petugas created successfully",
        id_petugas: petugasId,
      });
    } else {
      response.status(400).json({ message: "Failed to create petugas" });
    }
  }

  public async edit({ request, response }: HttpContextContract) {
    const { id, column, value } = request.body();

    try {
      await Database.from("pegawai")
        .where("nomer", id)
        .update({ [column]: value });

      response.status(201).json({
        message: "Update berhasil",
      });
    } catch (error) {
      console.log(error);

      response.status(400).json({
        message: "Update gagal",
        error: error.message,
      });
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.body();
    console.log(id);

    try {
      const query = await Database.rawQuery(
        `DELETE FROM pegawai WHERE nomer = '${id}'`
      );

      response.status(201).json(query);
    } catch (error) {
      response.status(400).json({
        message: "Delete gagal",
        error: error.message,
      });
    }
  }
}
