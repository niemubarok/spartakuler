import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Create customer table
    this.schema.createTable('customer', (table) => {
      table.string('id_customer', 20).primary()
      table.string('nama', 50)
      table.string('alamat', 50)
      table.string('telepon', 50)
      table.string('pic', 50)
      table.string('pic_hp', 20)
      table.string('pic_email', 50)
      table.string('lokasi', 10)
      table.string('unit_kerja', 10)
      table.string('ktp', 50)
      table.string('sim', 50)
      table.string('operator', 20)
      table.timestamp('tanggal')
      table.smallint('jenis_identitas')
      table.string('no_identitas', 50)
      table.string('tempat_lahir', 50)
      table.date('tgl_lahir')
      table.string('jenis_kelamin', 1)
      table.string('pekerjaan', 50)
      table.string('nama_kantor', 50)
      table.string('alamat_kantor', 50)
      table.string('telp_kantor', 50)
      table.string('agama', 10)
      table.string('stnk', 50)
      table.string('no_rangka', 50)
      table.string('no_mesin', 50)
      table.string('merk', 50)
      table.string('warna', 20)
      table.string('tahun', 4)
      table.string('status_rumah', 20)
      table.string('status_mobil', 20)
      table.string('hubungan_pemilik', 20)
      table.string('nama_pemilik', 50)
      table.string('asuransi', 50)
      table.string('nama_pembawa', 50)
      table.string('hubungan_pembawa', 20)
      table.string('nama_darurat', 50)
      table.string('hub_darurat', 20)
      table.string('telp_darurat', 50)
      table.string('jenis_member', 10)
      table.string('adm', 10)
      table.string('no_polisi', 50)
    })

    // Create jenis_langganan table (membership types)
    this.schema.createTable('jenis_langganan', (table) => {
      table.string('id', 10).primary()
      table.string('nama', 50)
      table.smallint('bayar')
      table.double('tarif')
      table.timestamp('periode_awal')
      table.integer('masa_berlaku')
      table.integer('maks')
      table.string('jenis_mobil')
    })

    // Create detail_langganan table (membership details)
    this.schema.createTable('detail_langganan', (table) => {
      table.string('id_langganan', 50).notNullable()
      table.string('nopol', 50).notNullable()
      table.string('jenis', 10)
      table.string('akses')
      table.smallint('enable').defaultTo(1)

      // Create composite primary key
      table.primary(['id_langganan', 'nopol'])
    })

    // Create card_member table
    this.schema.createTable('card_member', (table) => {
      table.string('id_member', 20).primary()
      table.string('id_card', 20)
      table.date('tgl')
      table.string('idcust', 20)
      table.string('nopol', 20)
      table.string('jenis_langganan', 10).references('id').inTable('jenis_langganan')
      table.timestamp('awal')
      table.timestamp('akhir')
      table.double('biaya')
      table.string('adm', 10)
      table.smallint('max_kendaraan')
      table.string('lokasi', 10)
    })

    // Create blacklist_kendaraan table
    this.schema.createTable('blacklist_kendaraan', (table) => {
      table.string('nopol', 50).primary()
      table.string('keterangan', 255)
      table.string('operator', 50)
      table.timestamp('tanggal')
      table.string('adm', 10)
      table.smallint('blacklist_for_exit')
    })
  }

  public async down() {
    this.schema.dropTable('blacklist_kendaraan')
    this.schema.dropTable('card_member')
    this.schema.dropTable('detail_langganan')
    this.schema.dropTable('jenis_langganan')
    this.schema.dropTable('customer')
  }
}