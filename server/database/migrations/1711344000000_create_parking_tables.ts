import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaksi_parkir'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 20).notNullable()
      table.string('no_pol', 20).notNullable()
      table.string('id_kendaraan', 20).notNullable()
      table.smallint('status').notNullable()
      table.string('id_pintu_masuk', 20)
      table.string('id_pintu_keluar', 20)
      table.timestamp('waktu_masuk')
      table.timestamp('waktu_keluar')
      table.string('id_op_masuk', 20)
      table.string('id_op_keluar', 20)
      table.string('id_shift_masuk', 20)
      table.string('id_shift_keluar', 20)
      table.string('kategori', 20)
      table.string('status_transaksi', 20)
      table.double('bayar_masuk').defaultTo(0)
      table.double('bayar_keluar').defaultTo(0)
      table.string('jenis_system', 20)
      table.timestamp('tanggal').notNullable()
      table.binary('pic_body_masuk')
      table.binary('pic_body_keluar')
      table.binary('pic_driver_masuk')
      table.binary('pic_driver_keluar')
      table.binary('pic_no_pol_masuk')
      table.binary('pic_no_pol_keluar')
      table.smallint('sinkron').defaultTo(0)
      table.string('adm', 10)
      table.string('alasan', 200)
      table.timestamp('pmlogin')
      table.timestamp('pklogin')
      table.smallint('upload').defaultTo(0)
      table.smallint('manual').defaultTo(0)
      table.string('veri_kode', 100)
      table.smallint('veri_check')
      table.string('veri_adm', 50)
      table.timestamp('veri_date')
      table.double('denda')
      table.double('extra_bayar')
      table.string('no_barcode', 30)
      table.string('jenis_langganan', 20)
      table.integer('post_pay')
      table.string('reff_kode')
      table.string('valet_adm')
      table.timestamp('waktu_valet')
      table.integer('valet_charge')
      table.string('valet_ops', 10)
      table.string('valet_nopol', 15)
      table.timestamp('login_waktu_valet')
      table.integer('cara_bayar')
      table.string('unit_member', 20)
      table.integer('reserved').defaultTo(0)
      table.integer('casual_denda').defaultTo(0)
      table.string('no_voucher', 32)
      table.string('seri_voucher', 16)
      table.string('no_access_in', 64)
      table.string('no_access_out', 64)
      table.integer('inap')
      table.binary('pic_plat_masuk')
      table.binary('pic_plat_keluar')

      // Create index
      table.index(['id', 'id_kendaraan', 'no_pol', 'status', 'veri_check'], 'Full_Transaksi_Parkir')
    })

    // Create jenis_mobil table
    this.schema.createTable('jenis_mobil', (table) => {
      table.string('id', 20).primary()
      table.string('nama', 50).notNullable()
      table.timestamp('tanggal').notNullable()
      table.string('short_cut', 10)
      table.smallint('orang').defaultTo(0)
      table.smallint('validasi')
      table.integer('need_access').defaultTo(0)
    })

    // Create nama_pos table 
    this.schema.createTable('nama_pos', (table) => {
      table.string('id', 20).primary()
      table.string('nama', 50).notNullable()
      table.smallint('jenis').notNullable()
      table.timestamp('tanggal').notNullable()
      table.string('lokasi', 20)
      table.smallint('grace_period').defaultTo(1)
      table.integer('manless')
      table.string('area', 10)
      table.integer('berlaku_maksimal')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable('jenis_mobil')
    this.schema.dropTable('nama_pos')
  }
}