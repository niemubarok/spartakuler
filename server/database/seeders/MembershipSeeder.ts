import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class MembershipSeeder extends BaseSeeder {
  public async run() {
    const now = new Date()
    const nextYear = new Date(now)
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    // Insert sample customers
    await Database.table('customer').multiInsert([
      {
        id_customer: 'CUST001',
        nama: 'John Doe',
        alamat: 'Jl. Sudirman No. 123',
        telepon: '081234567890',
        pic: 'John Doe',
        pic_hp: '081234567890',
        pic_email: 'john.doe@email.com',
        lokasi: 'JAKSEL',
        unit_kerja: '10',
        ktp: '3171234567890001',
        operator: '00001',
        tanggal: now,
        jenis_identitas: 1,
        no_identitas: '3171234567890001',
        jenis_kelamin: 'L',
        agama: 'Islam',
        no_polisi: 'B1111AA'
      },
      {
        id_customer: 'CUST002',
        nama: 'Jane Smith',
        alamat: 'Jl. Thamrin No. 456',
        telepon: '081234567891',
        pic: 'Jane Smith',
        pic_hp: '081234567891',
        pic_email: 'jane.smith@email.com',
        lokasi: 'JAKSEL',
        unit_kerja: '10',
        ktp: '3171234567890002',
        operator: '00001',
        tanggal: now,
        jenis_identitas: 1,
        no_identitas: '3171234567890002',
        jenis_kelamin: 'P',
        agama: 'Islam',
        no_polisi: 'B2222BB'
      }
    ])

    // Insert card member data
    await Database.table('card_member').multiInsert([
      {
        id_member: 'MEM001',
        id_card: 'CARD001',
        tgl: now,
        idcust: 'CUST001',
        nopol: 'B1111AA',
        jenis_langganan: '01', // TENANT
        awal: now,
        akhir: nextYear,
        biaya: 1200000,
        adm: '00001',
        max_kendaraan: 1,
        lokasi: 'JAKSEL'
      },
      {
        id_member: 'MEM002',
        id_card: 'CARD002',
        tgl: now,
        idcust: 'CUST002',
        nopol: 'B2222BB',
        jenis_langganan: '02', // VIP/COMPLIMENT
        awal: now,
        akhir: nextYear,
        biaya: 0,
        adm: '00001',
        max_kendaraan: 1,
        lokasi: 'JAKSEL'
      }
    ])

    // Insert detail_langganan data
    await Database.table('detail_langganan').multiInsert([
      {
        id_langganan: 'MEM001',
        nopol: 'B1111AA',
        jenis: 'A', // Car
        enable: 1
      },
      {
        id_langganan: 'MEM002',
        nopol: 'B2222BB',
        jenis: 'A', // Car
        enable: 1
      }
    ])

    // Add some sample transactions for member vehicles
    await Database.table('transaksi_parkir').multiInsert([
      {
        id: 'TRX007',
        no_pol: 'B1111AA',
        id_kendaraan: 'A',
        status: 0,
        id_pintu_masuk: '01',
        id_pintu_keluar: 'PK1',
        waktu_masuk: now,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S1',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 0, // Member doesn't pay
        tanggal: now,
        jenis_langganan: '01',
        sinkron: 0,
        upload: 0,
        manual: 0
      },
      {
        id: 'TRX008',
        no_pol: 'B2222BB',
        id_kendaraan: 'A',
        status: 1,
        id_pintu_masuk: '01',
        waktu_masuk: now,
        id_op_masuk: '00001',
        id_shift_masuk: 'S1',
        status_transaksi: '1',
        bayar_masuk: 0,
        tanggal: now,
        jenis_langganan: '02',
        sinkron: 0,
        upload: 0,
        manual: 0
      }
    ])

    // Add audit records for completed member transactions
    await Database.table('parkir_transaksi').insert({
      id: 'TRX007',
      no_pol: 'B1111AA',
      id_kendaraan: 'A',
      status: 0,
      id_pintu_masuk: '01',
      id_pintu_keluar: 'PK1',
      waktu_masuk: now,
      waktu_keluar: now,
      id_op_masuk: '00001',
      id_op_keluar: '00001',
      id_shift_masuk: 'S1',
      id_shift_keluar: 'S1',
      status_transaksi: '0',
      bayar_masuk: 0,
      bayar_keluar: 0,
      tanggal: now,
      jenis_langganan: '01'
    })
  }
}