import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Create parkir_transaksi table (audit table)
    this.schema.createTable('parkir_transaksi', (table) => {
      table.string('id', 20)
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
      table.double('bayar_masuk')
      table.double('bayar_keluar')
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
      table.string('no_voucher', 32)
      table.string('seri_voucher', 16)
      table.string('no_access_in', 64)
      table.string('no_access_out', 64)
      table.integer('inap')

      // Create index same as transaksi_parkir
      table.index(['id', 'id_kendaraan', 'no_pol', 'status', 'veri_check'], 'Full_Parkir_Transaksi')
    })

    // Create nx_audit table for tracking audit values
    this.schema.createTable('nx_audit', (table) => {
      table.string('db', 64).notNullable()
      table.smallint('ratio').notNullable()
      table.integer('real').defaultTo(0)
      table.integer('audit').defaultTo(0)
      table.timestamp('last').defaultTo(this.now())
      table.integer('awal')
      table.integer('akhir')
      table.double('limit_value')
    })
  }

  public async down() {
    this.schema.dropTable('parkir_transaksi')
    this.schema.dropTable('nx_audit') 
  }
}