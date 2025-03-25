import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InitialSeeder extends BaseSeeder {
  public async run() {
    // Insert level_user data
    await Database.table('level_user').multiInsert([
      {
        level_id: '0001',
        level_code: 'ADMIN',
        level_name: 'Administrator',
        create_by: 'SYSTEM',
        create_date: new Date()
      }
    ])

    // Insert default admin user
    await Database.table('pegawai').insert({
      nomer: '00001',
      nama: 'Administrator',
      tgl_lahir: '2004-02-25',
      tgl_masuk: '2004-02-25',
      username: 'admin',
      password: 'admin', // In production, this should be hashed
      bisalogin: 1,
      status: 1,
      jeniskelamin: 0,
      agama: '0001',
      level_pegawai: '0001'
    })

    // Insert shift configurations
    await Database.table('shift').multiInsert([
      {
        id: 'S1',
        mulai: '05:45',
        selama: 480, // 8 hours in minutes
        tanggal: new Date()
      },
      {
        id: 'S2',
        mulai: '13:45',
        selama: 480,
        tanggal: new Date()
      },
      {
        id: 'S3',
        mulai: '21:45',
        selama: 540, // 9 hours in minutes
        tanggal: new Date()
      }
    ])

    // Insert vehicle types (jenis_mobil)
    await Database.table('jenis_mobil').multiInsert([
      {
        id: 'A',
        nama: 'Mobil',
        tanggal: new Date(),
        short_cut: 'A',
        orang: 0,
        validasi: 0
      },
      {
        id: 'C',
        nama: 'Motor',
        tanggal: new Date(),
        short_cut: 'C',
        orang: 0,
        validasi: 0
      },
      {
        id: 'D',
        nama: 'Truck/Box',
        tanggal: new Date(),
        short_cut: 'D',
        orang: 0,
        validasi: 0
      }
    ])

    // Insert parking gate configurations (nama_pos)
    await Database.table('nama_pos').multiInsert([
      {
        id: '01',
        nama: 'Pintu Masuk Mobil',
        jenis: 0,
        tanggal: new Date(),
        grace_period: 1,
        manless: 1
      },
      {
        id: '02',
        nama: 'Pintu Masuk Motor',
        jenis: 0,
        tanggal: new Date(),
        grace_period: 1,
        manless: 1
      },
      {
        id: 'PK1',
        nama: 'Pintu Keluar Mobil',
        jenis: 1,
        tanggal: new Date(),
        grace_period: 1,
        manless: 0
      },
      {
        id: 'PK2',
        nama: 'Pintu Keluar Motor',
        jenis: 1,
        tanggal: new Date(),
        grace_period: 1,
        manless: 0
      }
    ])

    // Insert membership types
    await Database.table('jenis_langganan').multiInsert([
      {
        id: '01',
        nama: 'TENANT',
        bayar: 1
      },
      {
        id: '02',
        nama: 'VIP/COMPLIMENT',
        bayar: 0
      }
    ])

    // Insert basic configuration
    await Database.table('config_file').insert({
      exit_pass: 0,
      jam_malam_mulai: '  :  :  ',
      jam_malam_selesai: '  :  :  ',
      pengguna_exit_pass: 0,
      footer_in_1: 'JANGAN TINGGALKAN BARANG BERHARGA',
      footer_in_2: 'DIDALAM KENDARAAN ANDA',
      footer_in_3: '',
      footer_out_1: '',
      footer_out_2: '',
      footer_out_3: ''
    })

    // Insert audit configuration
    await Database.table('nx_audit').insert({
      db: 'test',
      ratio: 100,
      real: 0,
      audit: 0,
      last: new Date(),
      limit_value: 100000
    })
  }
}