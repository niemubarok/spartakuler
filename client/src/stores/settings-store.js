import { defineStore } from "pinia";
import { ref } from "vue";
import ls from "localstorage-slim";
import axios from "axios";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    API_URL: ref(ls.get("API_URL")) || "-",
    prefix: ref(ls.get("prefix") || "-"),
    posConfig: ref([]),
    logo: ref([]),
    isLicenseExpired: ref(false),
    pesan: ref([]),
    companyName: process.env.COMPANY_NAME,
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async loadSettings() {
      const res = await axios.get(this.API_URL + "/settings/soft-setting");
      const [data] = res.data;
      this.logo = data.logo;
      this.isLicenseExpired = data.lisensi === 1 ? false : true;
      // this.companyName = data.namalokasi;
      // ls.set("companyName", this.companyName);
      console.log(data);
      return data;
    },
    async getPosConfig() {
      try {
        const response = await axios.post(
          this.API_URL + "/settings/config-pos",
          {
            id_pos: ls.get("lokasiPos").value,
          }
        );
        console.log(response.data);
        this.prefix = Array.isArray(response.data)
          ? response.data[0].prefix
          : response.data.prefix;
        ls.set("prefix", this.prefix);
        this.posConfig = response.data;
      } catch (error) {}
    },
    async getPesan() {
      const res = await axios.get(this.API_URL + "/settings/pesan");
      const data = res.data;
      this.pesan = Object.values(data).map((item) => item.pesan);
    },
  },
});
