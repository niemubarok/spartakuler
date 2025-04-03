import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SettingsController {
  public async configPos({request, response}: HttpContextContract) {

    const params = request.body()
    const config_pos = await Database.from('config_pos')
      .select('prefix')
      .where('id_pos', params.id_pos)
      .first()

    response.status(200).json(config_pos)
  }

  public async configHardware({}: HttpContextContract) {
  }

  public async softSetting({}: HttpContextContract) {
  }

  public async logo({}: HttpContextContract) {
  }

  public async pesan({}: HttpContextContract) {
    // const pesan = await Database.from('pesan').select('*').where()
  }

  public async snapshot({}: HttpContextContract) {
  }

  public async destroy({}: HttpContextContract) {}
}
