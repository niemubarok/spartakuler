import { defineStore } from "pinia";
import { ref } from "vue";
import ls from "localstorage-slim";

// import { BetterSerialPort } from "better-serial-port";
const { serialport } = window.electron;
const port = serialport("/dev/ttyUSB0");

export const useComponentStore = defineStore("component", {
  state: () => ({
    isSidebar: ref(false),
    isHeader: ref(false),
    availableCameras: ref([]),
    hideInputPlatNomor: ref(false),
    camera: ref({
      in: ls.get("cameraIn"),
      out: ls.get("cameraOut"),
    }),
    paymenCardKey: ref(0),
    outGateKey: ref(0),
    cameraInKey: ref(0),
    cameraOutKey: ref(0),
    outGateDevicePath: ref(ls.get("outGateDevicePath")),
    currentPage: ref(""),
    paymentDialogRef: ref(false),
    isPaymentDialogMounted: ref(false),
  }),
  actions: {
    async getAvailableCameras() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("devices", devices);
      return devices.filter((device) => device.kind === "videoinput");
    },
    setSelectedCamera(type, id) {
      if (type === "in") {
        ls.set("cameraIn", id);
        this.cameraId.value.in = id;
      } else if (type === "out") {
        ls.set("cameraOut", id);
        this.cameraId.value.out = id;
      }
    },
    setPaymentCardKey() {
      const key = Date.now();
      this.paymenCardKey = key;
      console.log(this.paymenCardKey);
    },
    setOutGateKey() {
      const key = Date.now();
      this.outGateKey = key;
      console.log(this.outGateKey);
    },
    setCameraInKey() {
      const key = Date.now();
      this.cameraInKey = key;
      console.log(this.cameraInKey);
    },
    setCameraOutKey() {
      const key = Date.now();
      this.cameraOutKey = key;
      console.log(this.cameraOutKey);
    },

    async openGate() {
      console.log("port", port);
      console.log("window", window.electron);
      await port.open();
      await port.write("*OUT1ON#");

      //
      // port.close();
    },
    async closeGate() {
      // const { serialport } = window.electron;
      // const port = serialport("/dev/ttyUSB0");
      // port.open();
      port.write("*OUT1OFF#");
      await port.close();
    },
  },
});
