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

  public async configHardware({request, response}: HttpContextContract) {
  }

  public async softSetting({response}: HttpContextContract) {
  }

  public async logo({response}: HttpContextContract) {
  }

  public async pesan({response}: HttpContextContract) {
    const pesan = await Database.from('pesan').select('*').where()
  }

  public async snapshot({response}: HttpContextContract) {
  }

  public async destroy({}: HttpContextContract) {}
}
