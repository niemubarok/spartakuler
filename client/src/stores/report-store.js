import { defineStore } from 'pinia'
import {api} from 'boot/axios'


export const useReportStore = defineStore('reports', {
  state: () => ({
    counter: 0
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    async getDataTransaksiPerTanggal(startDate,endDate){

      const response = await api.post('/reports/data-transaksi-per-tanggal', {
        
          startDate: startDate,
          endDate: endDate
        
      })
      console.log(response.data)
    },
    increment () {
      this.counter++
    }
  }
})
