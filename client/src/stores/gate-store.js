import { defineStore } from 'pinia'
import { ref } from "vue";
import ls from "localstorage-slim";

let serialport;
if (window && window.electron) {
    serialport = window.electron.serialport;
  }
  const port = ls.get("serialPort") && serialport ? serialport(ls.get("serialPort")) : null;

export const useGateStore = defineStore('gate', {
  state: () => ({
    serialPorts: ref({}), // Menyimpan multiple serial connections
    serialInputs: ref({}), 
    loop1:ref(false),
    loop2:ref(false),
    loop3:ref(false),
    audioPlayer: ref(null),
  }),

  actions: {
    playAudio(filename) {
      try {
        // Buat audio player baru jika belum ada
        if (!this.audioPlayer) {
          this.audioPlayer = new Audio();
        }

        // Set source ke file audio
        this.audioPlayer.src = `/audio/${filename}.wav`;
        
        // Play audio
        this.audioPlayer.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    },
    async initializeSerialPort(portConfig) {
      const { portName, type } = portConfig;
      if (!window.electron?.serialport) return;
      
      try {
        const port = window.electron.serialport(portName);
        this.serialPorts[type] = port;
        
        if (!port.isPortOpened()) {
          await port.open();
        }

        port.read((data) => {
          console.log(`🚀 ~ Serial data from ${type}:`, data);
          this.serialInputs[type] = data.toString();
          
          // Handle different port types
          switch(type) {
            case 'entry':
              this.handleEntryGate(data);
              break;
            case 'exit':
              this.handleExitGate(data);
              break;
            // Add more cases as needed
          }
        });

      } catch (err) {
        console.error(`Error initializing ${type} port:`, err);
      }
    },

    async closeSerialPort(type) {
      if (this.serialPorts[type]) {
        await this.serialPorts[type].close();
        delete this.serialPorts[type];
        delete this.serialInputs[type];
      }
    },

    async writeToPort(type, data) {
      if (this.serialPorts[type]) {
        await this.serialPorts[type].write(data);
      }
    },
    onPushLoop1() {
      this.loop1 = !this.loop1;
      if (this.loop1) {
        this.playAudio('welcome');
      } 
      // else {
      //   this.playAudio('loop1-off');
      // }
      console.log("loop1", this.loop1);
    },
    onPushLoop2() {
      this.loop2 = !this.loop2;
      if (this.loop2) {
        this.playAudio('masuk');
      }
      console.log("loop2", this.loop2);
    },
    onPushLoop3() {
      this.loop3 = !this.loop3;
      console.log("loop3", this.loop3);
    },

    handleEntryGate(data) {
      // Handle entry gate specific logic
      console.log("Entry gate data:", data);
      // Trigger plate capture or other actions
    },

    handleExitGate(data) {
      // Handle exit gate specific logic
      console.log("Exit gate data:", data);
      // Trigger payment process or other actions
    }
  }
})
