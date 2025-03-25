import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TarifSeeder extends BaseSeeder {
  public async run() {
    // Insert tariff configurations for different vehicle types
    await Database.table('tarif_rest').multiInsert([
      {
        id_mobil: 'A', // Car
        tarif: 5000,
        tarif_interval: 2000,
        interval: 60,
        waktu_tarif: 60,
        waktu_gratis: 0,
        bayar_dimuka: 0,
        denda: 10000,
        maksimum: 50000,
        tanggal: new Date(),
        tarif2: 0,
        waktu2: 0,
        tarif_period: 0,
        max_per_hari: 50000,
        min_per_hari: 5000,
        time_base: 0,
        adm: 'Administrator',
        tarif_inap: 0,
        time_base_maks: 24
      },
      {
        id_mobil: 'C', // Motorcycle
        tarif: 2000,
        tarif_interval: 1000,
        interval: 60,
        waktu_tarif: 60,
        waktu_gratis: 0,
        bayar_dimuka: 0,
        denda: 5000,
        maksimum: 20000,
        tanggal: new Date(),
        tarif2: 0,
        waktu2: 0,
        tarif_period: 0,
        max_per_hari: 20000,
        min_per_hari: 2000,
        time_base: 0,
        adm: 'Administrator',
        tarif_inap: 0,
        time_base_maks: 24
      },
      {
        id_mobil: 'D', // Truck
        tarif: 10000,
        tarif_interval: 5000,
        interval: 60,
        waktu_tarif: 60,
        waktu_gratis: 0,
        bayar_dimuka: 0,
        denda: 20000,
        maksimum: 100000,
        tanggal: new Date(),
        tarif2: 0,
        waktu2: 0,
        tarif_period: 0,
        max_per_hari: 100000,
        min_per_hari: 10000,
        time_base: 0,
        adm: 'Administrator',
        tarif_inap: 0,
        time_base_maks: 24
      }
    ])
  }
}