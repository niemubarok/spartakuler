import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TransaksiSeeder extends BaseSeeder {
  public async run() {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Sample transactions for cars
    await Database.table('transaksi_parkir').multiInsert([
      {
        id: 'TRX001',
        no_pol: 'B1234KJ',
        id_kendaraan: 'A', // Mobil
        status: 0, // Completed transaction
        id_pintu_masuk: '01',
        id_pintu_keluar: 'PK1',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 5000,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      },
      {
        id: 'TRX002',
        no_pol: 'B5678KJ',
        id_kendaraan: 'A', // Mobil
        status: 1, // Active/ongoing transaction
        id_pintu_masuk: '01',
        id_pintu_keluar: null,
        waktu_masuk: now,
        waktu_keluar: null,
        id_op_masuk: '00001',
        id_op_keluar: null,
        id_shift_masuk: 'S1',
        id_shift_keluar: null,
        status_transaksi: '1',
        bayar_masuk: 0,
        bayar_keluar: null,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      }
    ])

    // Sample transactions for motorcycles
    await Database.table('transaksi_parkir').multiInsert([
      {
        id: 'TRX003',
        no_pol: 'B1234ABC',
        id_kendaraan: 'C', // Motor
        status: 0, // Completed transaction
        id_pintu_masuk: '02',
        id_pintu_keluar: 'PK2',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 2000,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      },
      {
        id: 'TRX004',
        no_pol: 'B5678ABC',
        id_kendaraan: 'C', // Motor
        status: 1, // Active/ongoing transaction
        id_pintu_masuk: '02',
        id_pintu_keluar: null,
        waktu_masuk: now,
        waktu_keluar: null,
        id_op_masuk: '00001',
        id_op_keluar: null,
        id_shift_masuk: 'S1',
        id_shift_keluar: null,
        status_transaksi: '1',
        bayar_masuk: 0,
        bayar_keluar: null,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      }
    ])

    // Sample transactions for trucks
    await Database.table('transaksi_parkir').multiInsert([
      {
        id: 'TRX005',
        no_pol: 'B1234XYZ',
        id_kendaraan: 'D', // Truck
        status: 0, // Completed transaction
        id_pintu_masuk: '01',
        id_pintu_keluar: 'PK1',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 10000,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      },
      {
        id: 'TRX006',
        no_pol: 'B5678XYZ',
        id_kendaraan: 'D', // Truck
        status: 1, // Active/ongoing transaction
        id_pintu_masuk: '01',
        id_pintu_keluar: null,
        waktu_masuk: now,
        waktu_keluar: null,
        id_op_masuk: '00001',
        id_op_keluar: null,
        id_shift_masuk: 'S1',
        id_shift_keluar: null,
        status_transaksi: '1',
        bayar_masuk: 0,
        bayar_keluar: null,
        tanggal: now,
        sinkron: 0,
        upload: 0,
        manual: 0
      }
    ])

    // Insert corresponding audit records
    await Database.table('parkir_transaksi').multiInsert([
      {
        id: 'TRX001',
        no_pol: 'B1234KJ',
        id_kendaraan: 'A',
        status: 0,
        id_pintu_masuk: '01',
        id_pintu_keluar: 'PK1',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 5000,
        tanggal: now
      },
      {
        id: 'TRX003',
        no_pol: 'B1234ABC',
        id_kendaraan: 'C',
        status: 0,
        id_pintu_masuk: '02',
        id_pintu_keluar: 'PK2',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 2000,
        tanggal: now
      },
      {
        id: 'TRX005',
        no_pol: 'B1234XYZ',
        id_kendaraan: 'D',
        status: 0,
        id_pintu_masuk: '01',
        id_pintu_keluar: 'PK1',
        waktu_masuk: yesterday,
        waktu_keluar: now,
        id_op_masuk: '00001',
        id_op_keluar: '00001',
        id_shift_masuk: 'S1',
        id_shift_keluar: 'S2',
        status_transaksi: '0',
        bayar_masuk: 0,
        bayar_keluar: 10000,
        tanggal: now
      }
    ])
  }
}