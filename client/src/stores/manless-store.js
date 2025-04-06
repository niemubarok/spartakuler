import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { calculateParkingDuration } from 'src/utils/time-util'

export const useManlessStore = defineStore('manless', {
  state: () => ({
    counter: 0
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    async getTransactionByPlateNumber(plateNumber) {
      const response = await api.post(`/manless/transaction/by/plate-number`, {
        plate_number: plateNumber
      })
      console.log("🚀 ~ getTransactionByPlateNumber ~ response:", response)
      
      if (!response.statusText === 'OK') {
        throw new Error('Network response was not ok')
      }
      const [data] = await response.data
      return data
    },
    parkingDuration(entryTime){
      const duration = calculateParkingDuration(entryTime)
      return duration.days > 0
      ? duration.additionalHourAfter24 !== 0
        ? `${duration.days} Hari ${duration.additionalHourAfter24} Jam ${duration.minutes} Menit`
        : `${duration.days} Hari ${duration.minutes} Menit`
      : duration.hours > 0
      ? `${duration.hours} Jam ${duration.minutes} Menit`
      : `${duration.minutes} Menit`;
    },
    async calculateParkingFee(entryTime, waktuKeluar) {
      if (this.isMember && !this.isMemberExpired) {
        return 0;
      } else {
        const tarif = await this.getTarifJenisKendaraan();
        const tarifAwal = parseInt(tarif?.tarif);
        const tarifBerikutnya = parseInt(tarif?.tarif_interval);
        const tarifMaksimal = parseInt(tarif?.maksimum);
        const interval = parseInt(tarif?.interval);

        const currentTime = new Date();
        const targetTime = new Date(entryTime);
        const diffInMilliseconds = currentTime - targetTime;

        const durationInHour = Math.floor(
          diffInMilliseconds / (1000 * 60 * 60)
        );

        const interval24 = Math.floor(durationInHour / 24);
        // console.log("durationInHour", durationInHour);

        // Calculate the additional fee
        let additionalFee = durationInHour * tarifBerikutnya;
        let totalFee = 0;

        //jika dibawah 1 jam pakai tarif awal
        if (durationInHour <= 1) {
          totalFee = tarifAwal;
        }
        //jika diatas 1 jam tarif awal + tarif berikutnya
        else if (durationInHour > 1) {
          totalFee += additionalFee;
        }
        //jika total tarif lebih dari tarif maksimal
        if (totalFee > tarifMaksimal) {
          totalFee = tarifMaksimal;
        }

        // Calculate the number of 24-hour intervals
        const additionalHourAfter24 = durationInHour - interval24 * 24;
        // console.log("additionalHourAfter24", additionalHourAfter24);
        let additionalFeeAfter24 = additionalHourAfter24 * tarifBerikutnya;
        //jika lebih dari 24 jam tarif maksimal + tarif berikutnya
        if (interval24 > 0) {
          if (additionalFeeAfter24 > tarifMaksimal) {
            additionalFeeAfter24 = tarifMaksimal;
          }
          // console.log("additionalFeeAfter24", additionalFeeAfter24);
          totalFee = interval24 * tarifMaksimal + additionalFeeAfter24;
        }
        // console.log("interval24", interval24);
        if (this.isMember && !this.isMemberExpired) {
          totalFee = 0;
        }
        totalFee = Math.round(totalFee);

        this.biayaParkir = totalFee;
        return totalFee;
      }
    },
  }
})
