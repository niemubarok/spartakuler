import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Create level_user table
    this.schema.createTable('level_user', (table) => {
      table.string('level_id', 20).primary()
      table.string('level_code', 20).notNullable()
      table.string('level_name', 30)
      table.string('create_by').notNullable()
      table.timestamp('create_date')
      table.integer('update_by')
      table.timestamp('update_date')
    })

    // Create pegawai (employee) table
    this.schema.createTable('pegawai', (table) => {
      table.string('nomer', 20).primary()
      table.string('nama', 50).notNullable()
      table.string('alamat', 100)
      table.date('tgl_lahir')
      table.date('tgl_masuk')
      table.string('username', 50)
      table.string('password', 50)
      table.binary('foto')
      table.smallint('bisalogin').defaultTo(1)
      table.smallint('status').defaultTo(1)
      table.smallint('jeniskelamin')
      table.string('agama', 20)
      table.string('telepon', 50)
      table.string('alamat_lahir', 100)
      table.string('alamat_sekarang', 100)
      table.string('nip', 50)
      table.smallint('statusabsen')
      table.string('level_pegawai', 20).references('level_id').inTable('level_user')
    })

    // Create login_log table
    this.schema.createTable('login_log', (table) => {
      table.string('id_petugas', 20).notNullable().references('nomer').inTable('pegawai')
      table.string('id_shift', 20).notNullable()
      table.timestamp('time_login').notNullable()
      table.timestamp('time_logout')
      table.timestamp('tanggal').notNullable()
      table.string('pos', 10)
      table.string('akses_id', 64)
      table.string('adm', 16)
    })

    // Create manualbot table for tracking manual gate operations
    this.schema.createTable('manualbot', (table) => {
      table.string('petugas', 20).notNullable()
      table.string('id_shift', 20).notNullable()
      table.string('id_pos', 20).notNullable()
      table.timestamp('tanggal').notNullable()
      table.binary('pic')
    })
  }

  public async down() {
    this.schema.dropTable('manualbot')
    this.schema.dropTable('login_log')
    this.schema.dropTable('pegawai')
    this.schema.dropTable('level_user')
  }
}