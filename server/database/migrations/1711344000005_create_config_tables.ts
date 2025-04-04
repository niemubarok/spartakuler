import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Create config_pos table
    this.schema.createTable('config_pos', (table) => {
      table.string('id_pos', 20).primary()
      table.string('prefix', 20)
      table.integer('max_load_index')
      table.integer('camera_refresh')
      table.integer('max_nopol_avail')
      table.integer('max_nopol')
      table.integer('max_member_on_a_time')
      table.string('message', 100)
      table.smallint('info_member')
      table.smallint('ploting')
      table.smallint('info_volume')
      table.smallint('login_a_time')
      table.smallint('tiket_masalah')
      table.smallint('use_barcode')
      table.smallint('warning_member')
      table.integer('start_warning_member')
      table.smallint('add_barcode_struk_in')
      table.string('type_barcode_struk_in', 20)
      table.smallint('input_kode_pisah')
      table.smallint('cek_mobil_masalah')
      table.smallint('overwrite')
      table.smallint('no_reinput')
      table.smallint('pos_for_any_kode')
      table.string('any_kode', 20)
      table.smallint('confirm_input')
      table.smallint('akses_for_reprint')
      table.smallint('no_input_notrans')
      table.smallint('only_input_any_digit')
      table.string('any_digit', 20)
      table.smallint('input_notrans_only_open_gate')
      table.smallint('max_input_notrans')
      table.integer('max_input_notrans_value')
      table.smallint('autoprint_struk')
      table.smallint('reprint_struk_activ')
      table.smallint('no_reinput_out')
      table.string('shortcut_kode', 20)
      table.string('footer1', 100)
      table.string('footer2', 100)
      table.string('cetak_tambahan', 100)
      table.smallint('ouc')
      table.string('ouc_tipe_barcode', 20)
      table.string('footer3', 100)
      table.string('footer4', 100)
      table.smallint('kend_valid')
      table.smallint('swapable')
      table.string('id_pos_alternative', 20)
      table.smallint('manual_bg_enable')
      table.smallint('disable_manual')
      table.smallint('enable_icmp')
      table.smallint('show_print_counter')
      table.smallint('detail_muatan')
    })

    // Create config_file table
    this.schema.createTable('config_file', (table) => {
      table.smallint('exit_pass').defaultTo(0)
      table.string('jam_malam_mulai', 10)
      table.string('jam_malam_selesai', 10)
      table.smallint('pengguna_exit_pass').defaultTo(0)
      table.string('footer_in_1', 100)
      table.string('footer_in_2', 100)
      table.string('footer_in_3', 100)
      table.string('footer_out_1', 100)
      table.string('footer_out_2', 100)
      table.string('footer_out_3', 100)
      table.string('cetak_tambahan_in', 100)
      table.string('cetak_tambahan_out', 100)
    })

    // Create soft_setting table
    this.schema.createTable('softseting', (table) => {
      table.string('namasoft', 50)
      table.string('versoft', 50)
      table.string('namasystem', 50)
      table.string('versystem', 50)
      table.string('namaperusahaan', 100)
      table.string('alamat', 100)
      table.string('telepon', 50)
      table.string('namalokasi', 100)
      table.string('alamatlokasi', 100)
      table.smallint('softplatform')
      table.smallint('lisensi')
      table.integer('period')
      table.smallint('tipesoft')
      table.smallint('banyakclient')
      table.string('logo', 100)
      table.timestamp('tanggal')
      table.string('parkintf', 100)
      table.string('npwp', 50)
      table.string('nppkp', 50)
      table.smallint('smson')
      table.string('mail_name', 100)
      table.string('mail_address', 100)
      table.string('incom_mail', 100)
      table.string('out_mail', 100)
      table.string('pasw_mail', 100)
      table.integer('stok_awal')
      table.smallint('stok_kunci')
      table.string('cabang_lokasi', 50)
    })

    // Create kodeform table for menu access codes
    this.schema.createTable('kodeform', (table) => {
      table.integer('kode').primary()  
      table.string('nama', 50)
    })
  }

  public async down() {
    this.schema.dropTable('kodeform')
    this.schema.dropTable('softseting')
    this.schema.dropTable('config_file')
    this.schema.dropTable('config_pos')
  }
}