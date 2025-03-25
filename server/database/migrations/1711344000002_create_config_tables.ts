import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Create shift table for managing work shifts
    this.schema.createTable('shift', (table) => {
      table.string('id', 50).primary()
      table.string('mulai', 50).notNullable()
      table.bigInteger('selama').notNullable()
      table.timestamp('tanggal')
    })

    // Create master_lokasi table for managing parking locations
    this.schema.createTable('master_lokasi', (table) => {
      table.string('id_lokasi', 20).primary()
      table.string('nama_lokasi', 30)
      table.smallint('max_space')
      table.smallint('sisa')
      table.integer('prioritas')
    })

    // Create tarif table for parking rates
    this.schema.createTable('tarif', (table) => {
      table.string('id_mobil', 50).notNullable()
      table.double('tarif').notNullable()
      table.double('tarif_interval')
      table.integer('interval')
      table.integer('waktu_tarif')
      table.integer('waktu_gratis')
      table.smallint('bayar_dimuka')
      table.double('denda')
      table.double('maksimum')
      table.timestamp('tanggal')
      table.double('tarif2')
      table.integer('waktu2')
      table.double('tarif_period')
      table.smallint('max_per_hari')
      table.integer('min_per_hari')
      table.smallint('time_base')
      table.smallint('tarif_inap')
      table.string('batas_min_inap')
      table.string('max_kena_charge')
      table.smallint('tarif_member')
      table.bigInteger('tarif_voucher')
      table.smallint('voucher_frek')
      table.smallint('voucher_time')
      table.smallint('voucher_base')
      table.smallint('voucher_base_time')
      table.double('asuransi_incl')
      table.smallint('denda_only_casual')
      table.integer('frek_interval')
      table.integer('frek_waktu2')
      table.smallint('free_for_validasi')
      table.integer('time_base_maks')
      table.integer('free_pos_default')
      table.integer('tarif_valet')
      table.integer('type_tarif_member')
      table.string('start_time_member_charge')
      table.string('stop_time_member_charge')
      table.integer('min_time_tarif_member')
      table.integer('batas_inap_min')
      table.integer('periode_inap')
      table.integer('free_same_day')
      table.integer('valet_extra_time').defaultTo(0)
      table.integer('extra_charge_value').defaultTo(0)
      table.integer('extra_charge_time').defaultTo(0)
      table.double('tarif3')
      table.integer('waktu3')
      table.integer('frek_waktu3')
      table.integer('denda_member')
      table.integer('denda_only').defaultTo(0)
      table.integer('gratis_waktu_tertentu')
      table.string('start_gratis_waktu_tertentu', 5)
      table.string('stop_gratis_waktu_tertentu', 5) 
      table.string('tarif_member_valid_pos', 30)
      table.integer('free_same_hour')
      table.integer('max_free_same_hour')

      // Add foreign key to jenis_mobil
      table.foreign('id_mobil').references('id').inTable('jenis_mobil')
    })
  }

  public async down() {
    this.schema.dropTable('tarif')
    this.schema.dropTable('master_lokasi')
    this.schema.dropTable('shift')
  }
}