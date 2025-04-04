<template>
  <div 
    class="manless-entry fixed-center full-width" 
    :class="[{ 'dark-mode': isDark }, $attrs.class]"
  >
 
    <div class="row q-gutter-sm" >
      <div class="col-6 q-gutter-md q-mt-sm">
         <!-- Camera Section -->
         <div class="column">
          <!-- Left side - License Plate Camera -->
            <q-card flat class="camera-card bg-transparent" style="transform: scale(0.95);margin-top: -2vh;">
              <q-btn dense push :loading="isCapturing" :disable="isCapturing" label="Manual Capture" color="white"
                text-color="primary" class="text-bold absolute-bottom-left z-top q-ma-lg" @click="onPlateCaptured"
                icon="camera" />

              <Camera ref="plateCameraRef" :cameraUrl="plateCameraUrl" :fileName="'plate'" :isInterval="isAutoCaptureActive"
            :intervalTime="3000" cameraLocation="plate" :cameraType="ls.get('plateCameraDevice') ? 'usb' : 'cctv'"
            @captured="onPlateCaptured" @error="onCameraError" class="camera-feed" label="License Plate Camera" />
              <!-- <Camera ref="plateCameraRef" :manual-base64="base64String" :fileName="'plate'"
                :isInterval="isAutoCaptureActive" :intervalTime="3000" cameraLocation="plate"
                @captured="onPlateCaptured" camera-type="manual" @error="onCameraError" class="camera-feed"
                label="License Plate Camera" style="margin-top:-2dvh" /> -->

              <div v-if="plateResult?.plate_number && capturedPlate">
                <q-card class="plate-detection-overlay bg-dark q-pa-xs" :class="{ 'bg-white ': isDark }">
                  <q-badge style="top: -10px; left: 7px" class="bg-dark text-white absolute-top-left inset-shadow"
                    label="Plat Image" />
                  <img :src="capturedPlate" alt="Detected Plate" class="plate-detection-image" />
               
                </q-card>
              </div>
            </q-card>

          <!-- Right side - Driver Camera -->
            <q-card flat class="camera-card bg-transparent q-mb-lg" style="transform: scale(0.95);margin-top: -1vh;">
              <Camera ref="driverCameraRef" :cameraUrl="driverCameraUrl" :fileName="'driver'" :isInterval="false"
                cameraLocation="driver" :cameraType="ls.get('driverCameraDevice') ? 'usb' : 'cctv'"
                @error="onCameraError" class="camera-feed" label="Driver Camera" />
            </q-card>
        </div>


       
      </div>
      <div class="col-6 full-height items-center justify-center ">
        <q-card flat :class="isDark ? 'text-white' : 'bg-transparent text-primary'"
          style="height: 30px;">
          <div class="row items-center justify-end">
            <div class="row items-center justify-start q-mr-md">
              
              <Clock />
            </div>
            <div class="row items-center  justify-between q-gutter-md">
                <ConnectionIndicator :is-connected="isBackendConnected" label="Server" class="indicator-item" />
                <ConnectionIndicator :is-connected="isALPRConnected" label="ALPR" class="indicator-item" icon="videocam"
                iconOff="videocam_off" />
                <q-toggle :model-value="isDark" @update:model-value="toggleDarkMode" color="yellow" icon="dark_mode"
                class="text-white" />
                
              </div>
          </div>
        </q-card>
        <!-- <q-separator spaced    /> -->
        <div class="flex row q-mt-lg">
          <div class="col-6">
            <div class="column">
              <div class="col q-mb-md q-mt-md">
                <!-- NOMOR TIKET -->
                <q-chip square outline class="q-py-lg text-h6 text-dark q-mb-md relative" :class="isDark ? 'text-white' : 'text-dark'" style="width: 90%;" label="">
                  <q-badge color="primary" text-color="white" label="No. Tiket " class="q-mb-md absolute-top-left"
                    style="top: -8px; left: 5px" />
                </q-chip>
                <!-- PLAT NOMOR  -->
                <PlatNomor style="transform: scale(1.1)" class="q-mt-md q-ml-md" />
              </div>
             
            </div>
          </div>

          <div class="col-5 q-pl-md">
            <q-timeline color="grey-6"  layout="dense">
              <q-timeline-entry title="tanggalMasuk" subtitle="Tanggal Masuk" icon="today" />
              <!-- side="right" -->
              <q-timeline-entry title="waktuMasuk" subtitle="Waktu Masuk" icon="schedule" />
              <!-- side="right" -->

              <q-timeline-entry title="transaksiStore.durasi" subtitle="Lama Parkir" icon="timer" />
              <!-- side="right" -->
            </q-timeline>
          </div>
        </div>
        <div class="column ">

            <!-- TOTAL BAYAR  -->
            <q-card
              bordered
              class="glass text-dark q-pr-sm q-mr-xl relative full-width"
            >
            <div>

              <q-badge color="primary" text-color="white" label="Parking Fee" class="text-h5 q-mb-md absolute-top-left"
              style="top: -8px; left: 5px" />
            </div>
              <!-- style="width: 40vw" -->
              <q-card-section>
                <div
                  class="text-right text-weight-bold"
                  :class="isDark ? 'text-white' : 'text-dark'"
                  style="
                    font-size: clamp(2rem, 4rem, 5rem);
                    font-family: 'Courier Prime', monospace;
                  "
                >0
                  <!-- {{
                    transaksiStore.biayaParkir
                      .toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })
                      .split(",")[0]
                  }} -->
                </div>
              </q-card-section>
            </q-card>

          <!-- Activity Log -->
          <div class="col-4  q-mt-md">
            <q-card bordered flat class="log-card q-pt-md" :class="{ 'bg-dark text-white': isDark }">
              <div>
                <q-badge style="top: -8px; left: 5px" class="absolute-top-left text-white "
                  :class="{ 'text-white': isDark }">Recent Activity</q-badge>
              </div>
              <q-card-section>
                <q-scroll-area style="height: 10dvh;">
                  <q-list dense>
                    <q-item v-for="(log, index) in activityLogs.slice(0, 10)" :key="index">
                      <q-item-section>
                        <q-item-label :class="{
                          'text-negative': log.isError,
                          'text-white': isDark && !log.isError,
                          'text-dark': !isDark && !log.isError
                        }">
                          {{ log.message }}
                        </q-item-label>
                        <q-item-label caption :class="{ 'text-grey-5': isDark }">
                          {{ log.timestamp }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-8 column justify-between">
          
          <q-card class="q-mt-sm">

            <q-card-section>
              <div class="row items-center justify-between" >
                <div class="gate-status text-h5"
                  :class="{ 'text-positive': gateStatus === 'OPEN', 'text-negative': gateStatus === 'CLOSED' }">
                  <q-chip outline :color="gateStatus === 'OPEN' ? 'positive' : 'negative'" text-color="white"
                    icon="door_front">
                    Gate Status: {{ gateStatus }}
                  </q-chip>
                </div>
                <div class="row q-gutter-md">
                  <q-btn
                dense
                push
                icon="qr_code_scanner"
                color="primary"
                class="q-mt-md"
                @click="showQRScanner = true"
              >
                <q-tooltip>Scan QR Code</q-tooltip>
              </q-btn>
                  <q-btn dense push color="positive" icon="door_front" label="OPEN GATE" :loading="isProcessing"
                    :disable="isProcessing || gateStatus === 'OPEN'" @click="manualOpen" class="text-bold"
                    size="md" />
                  <q-btn dense push color="primary" icon="settings" @click="openSettings"
                    class="text-bold" size="md" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        </div>
      </div>
    </div>
  </div>
  <QRCodeScannerDialog
    v-model="showQRScanner"
    @hide="showQRScanner = false"
    @scanned="onQRCodeScanned"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, useAttrs } from 'vue'
import { useQuasar } from 'quasar'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'
import Camera from './Camera.vue'
import Clock from './Clock.vue'
import { api, alpr } from "src/boot/axios";
import ls from 'localstorage-slim'
import SettingsDialog from './SettingsDialog.vue'
import ConnectionIndicator from './ConnectionIndicator.vue';
import PlatNomor from './PlatNomor.vue'
import PlateNumber from './ALPRDetectedPlateNumber.vue'
import ALPRDetectedPlateNumber from './ALPRDetectedPlateNumber.vue'
import QRCodeScannerDialog from './QRCodeScannerDialog.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// Get external attributes
const attrs = useAttrs()

// Add inheritAttrs option
defineOptions({
  inheritAttrs: false
})

const base64String = ref(``)

watch(() => base64String, (newValue) => {
  if (newValue) {
    plateCameraRef.value?.setManualBase64(newValue);
  }
});

const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}


const isBackendConnected = ref(false);
const isALPRConnected = ref(false);

const $q = useQuasar()

// Camera refs
const plateCameraRef = ref(null)
const driverCameraRef = ref(null)
const isProcessing = ref(false)
const activityLogs = ref([])
const errorDialog = ref(false)
const isCapturing = ref(false)
const error = ref(null)
const plateResult = ref(null)
const plateImage = ref(null)
const gateStatus = ref('CLOSED')
const isAutoCaptureActive = ref(true) // Auto capture flag
// const isDark = ref(false)

// Watch for dark mode changes and save to localStorage
watch(isDark, (newValue) => {
  ls.set('darkMode', newValue)
  document.body.classList.toggle('body--dark', newValue)
})

// Camera URLs should come from settings
const plateCameraUrl = ref('')
const driverCameraUrl = ref('')

const INITIAL_INTERVAL = 10000; // 10 seconds
const MAX_INTERVAL = 120000;    // 2 minutes
let currentInterval = INITIAL_INTERVAL;
let backendConnectionInterval;
let ALPRConnectionInterval;

const checkBackendConnection = async () => {
  try {
    await api.get('/health');
    isBackendConnected.value = true;
    // Reset interval on success
    currentInterval = INITIAL_INTERVAL;
    updateIntervals();
  } catch (error) {
    isBackendConnected.value = false;
    console.error('Server connection error:', error);
    // Increase interval on failure (up to MAX_INTERVAL)
    currentInterval = Math.min(currentInterval * 2, MAX_INTERVAL);
    updateIntervals();
  }
};


const checkALPRConnection = async () => {
  try {
    await alpr.get('/health');
    isALPRConnected.value = true;
  } catch (error) {
    isALPRConnected.value = false;
    console.error('Server connection error:', error);
  }
};

const updateIntervals = () => {
  clearInterval(backendConnectionInterval);
  clearInterval(ALPRConnectionInterval);

  backendConnectionInterval = setInterval(checkBackendConnection, currentInterval);
  ALPRConnectionInterval = setInterval(checkALPRConnection, currentInterval);
};

// Methods
const detectPlate = async () => {
  try {
    isCapturing.value = true;
    error.value = null;
    plateImage.value = null; // Reset plate image

    // Get image file from camera
    const imageFile = await plateCameraRef.value.getImage();

    // Create FormData and append file
    const formData = new FormData();
    formData.append('file', imageFile);

    // Make request to ALPR service
    const alprResponse = await alpr.post(
      '/detect-plate' || 'http://localhost:5000/detect-plate',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    if (alprResponse.data.length > 0) {
      const bestMatch = alprResponse.data?.[0];
      plateResult.value = bestMatch;

      // Set plate image if available in response
      // if (bestMatch.plate_image) {
      //   plateImage.value = `data:image/jpeg;base64,${bestMatch.plate_image}`;

      // Auto hide plate image after 5 seconds
      // setTimeout(() => {
      //   plateImage.value = null;
      //   plateResult.value = null;
      // }, 5000);
      // }


    } else {
      $q.notify({
        type: 'warning',
        message: 'No plate detected',
        position: 'top'
      });
    }
  } catch (err) {
    console.error('Error detecting plate:', err);
    // error.value = err.response?.data?.error || 'Failed to process license plate';
    // errorDialog.value = true;
    addActivityLog(`Error: ${error.value}`, true);

    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top'
    });
  } finally {
    isCapturing.value = false;
  }
};

const manualOpen = async () => {
  try {
    isProcessing.value = true
    error.value = null

    // await alpr.post('/transactions/manual-open-gate', {
    //   gateId: '01'
    // })

    gateStatus.value = 'OPEN'
    addActivityLog('Gate opened manually by operator')

    // Auto close after 30 seconds
    setTimeout(() => {
      if (gateStatus.value === 'OPEN') {
        gateStatus.value = 'CLOSED'
        addActivityLog('Gate closed automatically after timeout')
      }
    }, 30000)

  } catch (err) {
    console.error('Manual open error:', err)
    error.value = 'Failed to open gate manually'
    errorDialog.value = true
    addActivityLog('Failed to open gate manually', true)

    $q.notify({
      type: 'negative',
      message: error.value
    })
  } finally {
    isProcessing.value = false
  }
}

const openSettings = () => {
  const dialog = $q.dialog({
    component: SettingsDialog,
    componentProps: {
      persistent: true
    }
  });
  dialog.onOk(() => {
    // Refresh settings after dialog closes
    plateCameraUrl.value = ls.get('plateCameraUrl') || '';
    driverCameraUrl.value = ls.get('driverCameraUrl') || '';
  });
};

const addActivityLog = (message, isError = false) => {
  activityLogs.value.unshift({
    message,
    timestamp: new Date().toLocaleTimeString(),
    isError
  })

  // Keep only last 100 logs
  if (activityLogs.value.length > 100) {
    activityLogs.value = activityLogs.value.slice(0, 100)
  }
}

const detectedPlates = ref([])
const capturedPlate = ref(null)
const capturedDriver = ref(null)
const bestConfidenceDetectedPlate = ref(null)
const addDetectedPlate = (plate) => {
  const { plate_number, confidence, processing_time } = plate
  detectedPlates.value.push({
    plate_number,
    confidence: confidence.toFixed(2),
    processing_time: processing_time.toFixed(2)
  })
  if (detectedPlates.value?.length > 3) {
    detectedPlates.value.shift()
  }
}

const dataToStore = computed(() => ({
  detected_plates: detectedPlates.value,
  plate_image: capturedPlate.value,
  driver_image: capturedDriver.value,
  timestamp: new Date().toISOString(),
  gate_status: gateStatus.value,
  location: 'ENTRY_GATE_1', // Add your location identifier
  processing_time: detectPlate.value?.processing_time, // Add processing time if available
  operator: 'SYSTEM' // Or add operator ID if manual control
}))

const sendDataToBackend = async () => {
  try {
    const formData = new FormData();

    // Get images directly as File objects
    if (plateCameraRef.value) {
      const plateImage = await plateCameraRef.value.getImage();
      formData.append('plate_image', plateImage, 'plate.jpg');
    }

    if (driverCameraRef.value) {
      const driverImage = await driverCameraRef.value.getImage();
      formData.append('driver_image', driverImage, 'driver.jpg');
    }

    // Append other data
    formData.append('detected_plates', JSON.stringify(detectedPlates.value));
    formData.append('timestamp', new Date().toISOString());
    formData.append('gate_status', gateStatus.value);
    formData.append('location', 'ENTRY_GATE_1');
    formData.append('operator', 'SYSTEM');

    const response = await api.post('/manless/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Data saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving data to backend:', error);
  }
};

// Handle plate capture event from Camera component
const onPlateCaptured = async () => {
  // Capture driver image first
  try {
    const driverImage = await driverCameraRef.value.getImage();
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(driverImage);
    reader.onloadend = () => {
      capturedDriver.value = reader.result;
    }
  } catch (err) {
    console.error('Failed to capture driver image:', err);
  }


  // Continue with plate detection
  for (let i = 0; i < 3; i++) {
    await detectPlate();
    if (i == 0) {
      capturedPlate.value = `data:image/jpeg;base64,${plateResult.value?.plate_image}`
    }

    if (plateResult.value) {

      if (plateResult.value?.confidence >= 0.8) {
        if (gateStatus.value === 'CLOSED') {
          gateStatus.value = 'OPEN';
        }
        // Open gate if closed and plate detected
        addActivityLog(`Gate opened automatically for plate ${plateResult.value?.plate_number}`);

        // Auto close after 30 seconds
        setTimeout(() => {
          if (gateStatus.value === 'OPEN') {
            gateStatus.value = 'CLOSED';
            addActivityLog('Gate closed automatically after timeout');
          }
        }, 30000);
      }

      addDetectedPlate(plateResult.value);

      if (plateResult.value?.confidence > 0.85) {
        bestConfidenceDetectedPlate.value = plateResult.value?.plate_number
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Send data to backend after detection
  await sendDataToBackend();
}



const onCameraError = (err) => {
  error.value = `Camera error: ${err.message}`
  errorDialog.value = true
  addActivityLog(error.value, true)

  // $q.notify({
  //   type: 'negative',
  //   message: error.value
  // })
}

const dismissError = () => {
  errorDialog.value = false
  error.value = null
}

const openSettingsFromError = () => {
  dismissError()
  openSettings()
}

const showQRScanner = ref(false)

const onQRCodeScanned = (result) => {
  console.log("🚀 ~ onQRCodeScanned ~ result:", result)
  // Handle the scanned QR code result
  // For example, you could set it as the ticket number:
  // transaksiStore.nomorTiket = result
  showQRScanner.value = false
}

onMounted(async () => {
  // Load dark mode preference
  // isDark.value = ls.get('darkMode') || false
  document.body.classList.toggle('body--dark', isDark.value)

  await checkBackendConnection();
  await checkALPRConnection();
  updateIntervals();

  // Load camera URLs from settings
  plateCameraUrl.value = ls.get('plateCameraUrl') || ''
  console.log("🚀 ~ onMounted ~ plateCameraUrl.value:", plateCameraUrl.value)
  driverCameraUrl.value = ls.get('driverCameraUrl') || ''

  // Add initial log
  addActivityLog('Manless system initialized')
})

// Clean up on component destroy
onUnmounted(() => {
  // Stop any ongoing camera operations
  if (plateCameraRef.value) {
    plateCameraRef.value.stopInterval()
  }
  // Clean up intervals
  clearInterval(backendConnectionInterval);
  clearInterval(ALPRConnectionInterval);
})
</script>

<style scoped>
.indicator-item {
  backdrop-filter: blur(4px);
}

.connection-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  color: rgb(99, 252, 132);
  transition: all 0.3s ease;
}

/* Add pulse animation */
.connection-indicator::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(99, 252, 132);
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(99, 252, 132, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(99, 252, 132, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(99, 252, 132, 0);
  }
}

/* Add red color for disconnected state */
.connection-indicator.disconnected::before {
  background-color: rgb(255, 82, 82);
  animation: pulse-red 1.5s ease infinite;
}

@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(255, 82, 82, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

.connection-indicator.connected {
  background-color: rgba(0, 128, 0, 0.6);
}

.connection-indicator.disconnected {
  background-color: rgba(255, 0, 0, 0.6);
}

.manless-entry {
  height: 100vh;
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
  padding: 0.3rem;
}

.manless-entry.dark-mode {
  background-color: #121212;
}

.dark-mode .camera-card,
.dark-mode .control-card,
.dark-mode .log-card {
  background-color: rgba(30, 30, 30, 0.95) !important;
  color: #fff;
}

.camera-card,
.control-card,
.log-card,
.header-card {
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark-mode .camera-feed {
  background-color: #1e1e1e;
  border: 1px solid #333;
}

.camera-feed {
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.plate-result {
  background-color: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .plate-result {
  background-color: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.plate-image {
  max-width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.dark-mode .plate-image {
  border-color: #333;
}

.header-card {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-dark) 100%);
}

.dark-mode .header-card {
  background: linear-gradient(135deg, #1e1e1e 0%, #000 100%);
}

.q-card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark-mode .q-card {
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
}

.plate-camera-container {
  position: relative;
}

.plate-detection-overlay {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: min(200px, 90%);
  height: auto;
  pointer-events: none;
  z-index: 100;
}

.plate-detection-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform-origin: bottom right;
}

/* Add animate.css classes for zoom animation */
.animate__animated {
  animation-duration: 0.5s;
}

.animate__zoomIn {
  animation-name: zoomIn;
}

.animate__zoomOut {
  animation-name: zoomOut;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
}

/* Add responsive styles */
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.2rem !important;
  }

  .text-h6 {
    font-size: 1rem !important;
  }

  .q-btn {
    padding: 4px 8px;
  }

  .q-card-section {
    padding: 12px !important;
  }

  .plate-detection-overlay {
    position: relative;
    bottom: auto;
    right: auto;
    width: 100%;
    margin-top: 1rem;
  }

  .camera-feed {
    min-height: 200px;
  }

  .q-scroll-area {
    height: 200px !important;
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .camera-feed {
    min-height: 300px;
  }

  .plate-detection-overlay {
    width: 250px;
  }
}
</style>