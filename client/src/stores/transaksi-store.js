import { defineStore } from "pinia";
import { capitalize, ref } from "vue";
import { format } from "quasar";
import ls from "localstorage-slim";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const useTransaksiStore = defineStore("transaksi", {
  state: () => ({
    API_URL: ref(ls.get("API_URL")) || "-",
    dataCustomer: ref(""),
    transaksi: ref([]),
    lokasiPos: ref(ls.get("lokasiPos") || "-"),
    jenisKendaraan: [],
    selectedJenisKendaraan: ref(""),
    platNomor: ref(""),
    nomorTiket: ref(""),
    isMember: ref(false),
    isMemberExpired: ref(false),
    isCheckedIn: ref(false),
    waktuMasuk: ref(""),
    waktuKeluar: ref(""),
    durasi: ref(0),
    biayaParkir: ref(0),
    bayar: ref(),
    pic_body_keluar: ref(null),
  }),
  actions: {
    setAPIURL(url) {
      ls.get("API_URL", url);
    },
    setTransaksi(transaksi) {
      this.transaksi = transaksi;
    },

    async updateTableTransaksi() {
      const formData = {
        // id: uuidv4(),
        nomorTiket: this.nomorTiket,
        no_pol: this.platNomor,
        id_kendaraan: this.selectedJenisKendaraan.value,
        status: 0,
        // id_pintu_masuk: null,
        // id_pintu_keluar: null,
        // waktu_masuk: "",
        waktu_keluar: new Date().toISOString(),
        // id_op_masuk: null,
        id_op_keluar: ls.get("pegawai"),
        // id_shift_masuk: null,
        id_shift_keluar: ls.get("shift"),
        // kategori: null,
        status_transaksi: "0",
        // bayar_masuk: null,
        bayar_keluar: this.biayaParkir,
        // jenis_system: null,
        tanggal: new Date().toISOString(),
        // pic_body_masuk: "",
        pic_body_keluar: this.pic_body_keluar,
        // pic_driver_masuk: null,
        // pic_driver_keluar: null,
        // pic_no_pol_masuk: null,
        // pic_no_pol_keluar: null,
        // sinkron: 0,
        // adm: null,
        // alasan: null,
        // pmlogin: null,
        pklogin: new Date().toISOString(),
        // upload: 0,
        // manual: 0,
        // veri_kode: null,
        // veri_check: null,
        // veri_adm: null,
        // veri_date: null,
        // denda: null,
        // extra_bayar: null,
        no_barcode: this.nomorTiket,
        // jenis_langganan: null,
        // post_pay: 0,
        // reff_kode: "",
        // valet_adm: null,
        // waktu_valet: null,
        // valet_charge: null,
        // valet_ops: null,
        // valet_nopol: null,
        // login_waktu_valet: null,
        // cara_bayar: null,
        // unit_member: null,
        // reserved: 0,
        // no_voucher: null,
        // seri_voucher: null,
        // no_access_in: null,
        // no_access_out: null,
        // inap: null,
        // casual_denda: null,
      };

      try {
        const update = await axios.patch(
          this.API_URL + "/transactions/update",
          {
            formData,
          }
        );

        if (update.status == 200) {
          console.log(update.data);
          return 200;
        }
      } catch (error) {}
    },
    setCheckIn(isCheckedIn) {
      this.isCheckedIn = isCheckedIn;
    },
    async getJenisKendaraan() {
      // const localData = ls.get("jenisKendaraan");
      // if (localData) {
      //   this.jenisKendaraan = JSON.parse(localData);
      // } else {
      const response = await fetch(this.API_URL + "/vehicles/all");
      const data = await response.json();
      // console.log(data);
      this.jenisKendaraan = data;
      ls.set("jenisKendaraan", JSON.stringify(data));
      // }
    },
    async getTransaksiByNopol(no_pol) {
      // console.log(no_pol);
      const response = await axios.post(this.API_URL + "/transactions/nopol", {
        no_pol: no_pol,
      });
      const data = response.data;
      // console.log(data);
      this.transaksi.value = data;
      return data;
    },

    async getLokasiPos() {
      // const localData = ls.get("lokasiPos");
      // if (localData) {
      //   this.lokasiPos.value = JSON.parse(localData);
      // } else {
      const response = await fetch(this.API_URL + "/locations/all");
      const data = await response.json();
      const lokasiPos = data.map((data) => {
        return {
          label: data.nama,
          value: data.id,
          jenis: data.jenis,
        };
      });
      return lokasiPos;
      // console.log(data);
      // this.lokasiPos.value = data;
      // ls.set("lokasiPos", data);
      // }
    },
    async getCustomerByNopol() {
      console.log(this.platNomor);
      const res = await axios.post(this.API_URL + "/customers/nopol", {
        no_pol: this.platNomor?.toUpperCase(),
      });

      if (res.data) {
        this.isMember = true;
        this.dataCustomer = res.data;
        console.log(res.data);
        return res.data;
      } else {
        this.isMember = false;
      }

      // return res;
    },

    async getTarifJenisKendaraan() {
      const response = await axios.post(this.API_URL + "/prices/type", {
        id_jenis_kendaraan: this.selectedJenisKendaraan?.value,
      });
      const data = response.data[0];
      console.log(data);
      return data;
    },

    async calculateParkingFee(waktuMasuk, waktuKeluar) {
      if (this.isMember && !this.isMemberExpired) {
        return 0;
      } else {
        const tarif = await this.getTarifJenisKendaraan();
        const tarifAwal = parseInt(tarif?.tarif);
        const tarifBerikutnya = parseInt(tarif?.tarif_interval);
        const tarifMaksimal = parseInt(tarif?.maksimum);
        const interval = parseInt(tarif?.interval);

        // Calculate the duration in minutes
        const durationInMinutes = Math.ceil(
          (waktuKeluar - waktuMasuk) / (1000 * 60)
        );
        // console.log("durationInMinutes", durationInMinutes);

        // Calculate the number of additional hours
        const additionalHours = Math.round(
          Math.max(durationInMinutes - interval, 0) / 60
        );
        // console.log("additionalHours", additionalHours);

        // Calculate the additional fee
        let additionalFee = additionalHours * tarifBerikutnya;
        if (additionalFee > tarifMaksimal) {
          additionalFee = tarifMaksimal;
        }

        // console.log("additionalFee", additionalFee);

        // Calculate the total fee and round it
        let totalFee = tarifAwal + additionalFee;
        if (totalFee > tarifMaksimal) {
          totalFee = tarifMaksimal;
        }

        // console.log("maksimal", tarifMaksimal);

        totalFee = Math.round(totalFee);
        this.biayaParkir = totalFee;
        console.log("totalFee", totalFee);
        return totalFee;
      }
    },
  },
});
