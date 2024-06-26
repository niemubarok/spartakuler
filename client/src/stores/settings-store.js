import { defineStore } from "pinia";
import { ref } from "vue";
import ls from "localstorage-slim";
import axios from "axios";
import { api } from "src/boot/axios";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    API_URL: ref(ls.get("API_URL")) || "-",
    prefix: ref(ls.get("prefix") || "-"),
    posConfig: ref([]),
    logo: ref([]),
    isLicenseExpired: ref(false),
    pesan: ref([]),
    companyName: process.env.COMPANY_NAME,
    cameraInUrl: ref(ls.get("cameraInUrl") || "-"),
    cameraOutUrl: ref(ls.get("cameraOutUrl") || "-"),
    serialPort: ref(ls.get("serialPort") || "-"),
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
    async fetchCameraImage(fileName, cameraUrl) {
      try {
        const image = await api.get(`/cctv/snapshot?fileName=${fileName}&cctv_url=${cameraUrl}`);
        
        if (image.data.isSuccess) {
          // console.log("image.data.base64.split(",")[1] ", image.data.base64.split(",")[1]);
          return image.data.base64.includes("data:image/") ? image.data.base64.split(';base64,').pop() : image.data.base64;
        } else {
          return image.data.message;
        }
      } catch (error) {
        return error;
      }
    }
  },
});
