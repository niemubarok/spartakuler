<template>
  <div class="manless-entry" :class="{ 'dark-mode': isDark }">
    <!-- Header Section -->
    <div class="row q-mb-md ">
      <div class="col-12">
        <q-card flat class=" q-px-sm q-pt-sm" :class="isDark ? 'text-white' : 'bg-white text-primary'"
          style="height: 50px;">
          <!-- <q-card-section> -->
          <div class="row items-center justify-between">
            <div class="text-h5">Manless Entry System</div>
            <div class="row items-center q-gutter-md">
              <Clock />
              <q-toggle :model-value="isDark" @update:model-value="toggleDarkMode" color="yellow" icon="dark_mode"
                class="text-white" />
              <ConnectionIndicator :is-connected="isBackendConnected" label="Server" class="indicator-item" />
              <ConnectionIndicator :is-connected="isALPRConnected" label="ALPR" class="indicator-item" icon="videocam"
                iconOff="videocam_off" />
            </div>
          </div>
          <!-- </q-card-section> -->
        </q-card>
      </div>
    </div>

    <!-- Camera Section -->
    <div class="row q-col-gutter-xs ">
      <!-- Left side - License Plate Camera -->
      <div class="col-12 col-md-6">
        <q-card flat class="camera-card bg-transparent">
          <!-- <div class="q-ma-sm">
          </div> -->
          <!-- <q-card-section class="plate-camera-container"> -->
          <!-- <div class="row items-center justify-between q-mb-sm"> -->
          <!-- <q-badge outline color="dark" text-color="dark" class="text-body1 "  :class="{'text-white': isDark}">License Plate Camera</q-badge> -->
          <!-- <div class="text-h6">License Plate Camera</div> -->
          <q-btn dense push :loading="isCapturing" :disable="isCapturing" label="Manual Capture" color="white"
            text-color="primary" class="text-bold absolute-bottom-left z-top q-ma-lg" @click="onPlateCaptured"
            icon="camera" />
          <!-- </div> -->

          <!-- <Camera ref="plateCameraRef" :cameraUrl="plateCameraUrl" :fileName="'plate'" :isInterval="isAutoCaptureActive"
            :intervalTime="3000" cameraLocation="plate" :cameraType="ls.get('plateCameraDevice') ? 'usb' : 'cctv'"
            @captured="onPlateCaptured" @error="onCameraError" class="camera-feed" label="License Plate Camera" /> -->
          <Camera 
              ref="plateCameraRef"
              :manual-base64="base64String"
              :fileName="'plate'"
              :isInterval="isAutoCaptureActive"
              :intervalTime="3000"
              cameraLocation="plate"
              @captured="onPlateCaptured"
              camera-type="manual"
              @error="onCameraError"
              class="camera-feed"
              label="License Plate Camera"
              />
          <!-- :cropArea="{ x: 200, y: 50, width: 400, height: 200 }" -->

          <div v-if="plateResult?.plate_number && capturedPlate">
            <q-card class="plate-detection-overlay bg-dark q-pa-xs" :class="{ 'bg-white ': isDark }">
              <q-badge style="top: -10px; left: 7px" class="bg-dark text-white absolute-top-left inset-shadow"
                label="Plat Image" />
              <!-- <q-card-section> -->
              <img :src="capturedPlate" alt="Detected Plate" class="plate-detection-image" />
              <!-- </q-card-section> -->
            </q-card>
          </div>

          <!-- </q-card-section> -->
        </q-card>
      </div>

      <!-- Right side - Driver Camera -->
      <div class="col-12 col-md-6">
        <q-card flat class="camera-card bg-transparent">

          <Camera ref="driverCameraRef" :cameraUrl="driverCameraUrl" :fileName="'driver'" :isInterval="false"
            cameraLocation="driver" :cameraType="ls.get('driverCameraDevice') ? 'usb' : 'cctv'" @error="onCameraError"
            class="camera-feed" label="Driver Camera" />
        </q-card>
      </div>
    </div>

    <!-- Control Panel Section -->
    <div class="row q-col-gutter-md q-mt-sm">
      <!-- Gate Control -->
      <div class="col-8 column justify-between">
        <!-- detected plates -->

        <q-card class="control-card q-mt-md col">
          <div>
            <q-badge class="absolute text-body2 text-white " :class="{ 'text-white': isDark }">Detected Plates</q-badge>
          </div>
          <q-card-section>
            <!-- Plate Detection Overlay -->
            <transition enter-active-class="animate__animated animate__zoomIn"
              leave-active-class="animate__animated animate__zoomOut">
              <div class="row items-center justify-center q-ml-xl">
                <template v-if="detectedPlates.length">
                  <q-card flat v-for="plate in detectedPlates" :key="plate" class="q-pa-md bg-transparent">
                    <div class="row items-center q-gutter-sm">
                      <ALPRDetectedPlateNumber :key="plate" :plate_number="plate?.plate_number"
                        :badge="plate?.confidence" />
                    </div>
                  </q-card>
                </template>
                <template v-else>
                  <q-card flat class="q-pa-md bg-transparent" v-for="n in 3" :key="n">
                    <div class="column items-center q-gutter-sm">
                      <!-- <q-skeleton type="text" width="50px" height="24px" animation="wave" /> -->
                      <q-skeleton type="text" width="120px" height="10dvh" animation="wave" />
                    </div>
                  </q-card>
                </template>
              </div>
            </transition>
          </q-card-section>
        </q-card>
        <q-card class="control-card q-mt-sm">

          <q-card-section>
            <div class="row items-center justify-between">
              <div class="gate-status text-h5"
                :class="{ 'text-positive': gateStatus === 'OPEN', 'text-negative': gateStatus === 'CLOSED' }">
                <q-chip outline :color="gateStatus === 'OPEN' ? 'positive' : 'negative'" text-color="white"
                  class="text-h6" icon="door_front">
                  Gate Status: {{ gateStatus }}
                </q-chip>
              </div>
              <div class="row q-gutter-md">
                <q-btn dense push color="positive" icon="door_front" label="OPEN GATE" :loading="isProcessing"
                  :disable="isProcessing || gateStatus === 'OPEN'" @click="manualOpen" class="text-bold" size="md" />
                <q-btn dense push color="primary" icon="settings" label="SETTINGS" @click="openSettings"
                  class="text-bold" size="md" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Activity Log -->
      <div class="col-4  q-mt-md">
        <q-card class="log-card q-pt-md" :class="{ 'bg-dark text-white': isDark }">
          <div>
            <q-badge style="top: 0px; left: 0px" class="absolute text-body2 text-white "
              :class="{ 'text-white': isDark }">Recent Activity</q-badge>
          </div>
          <q-card-section>
            <q-scroll-area style="height: 25dvh;">
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
    </div>

    <!-- Error Display -->
    <!-- <q-dialog v-model="errorDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="negative" text-color="white" />
          <span class="q-ml-sm">{{ error }}</span>
        </q-card-section>
        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn 
            flat 
            icon="settings" 
            label="Settings" 
            color="primary" 
            @click="openSettingsFromError"
          />
          <q-btn 
            flat 
            label="Dismiss" 
            color="primary" 
            v-close-popup
            />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
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

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)


const base64String = ref(`/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9V
XVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSk
pKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCALQBQADASIA
AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA
AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3
ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm
p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA
AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx
BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK
U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3
uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDCpaBR
WxuFFLijFAxDSUtFFgCiiigApaKKYwoopaACiiigAoFFLQAUUUUxhRRRQA4VKgqIVNH1q0UipeZN
3KP9qoT0qa7JF3Ljuairnluc7ECk9KXb6HigHsKXJxjPSkCJ4v8AVD6momH7xhUsJzGfrUdwAH6n
d3GOlW9i5bIVQWjYgZ2DnmmxOFOGOAe+OlNVyoOO4xTT2qbkXLiNB3mH/fJoknijUeWRIx+oAqke
RnH1oxT52V7R7FiJgZPMkAPP3R3qAncSfWkpKlsi5LHJsIYKCfekjUPIoZsD19KjpysVz79adxDp
CTI29iWzyT1ppJIA7DpSZyeakt41lmVHfYp6t6UragMXBYAnA9adEu+VV9TVq6sFjt1mhcyJ3PHH
+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
`)

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
        if(gateStatus.value === 'CLOSED') {
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

      // if (plateResult.value?.confidence > 0.85) {
      //   bestConfidenceDetectedPlate.value = plateResult.value?.plate_number
      // }
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
  addActivityLog('Manless entry system initialized')
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
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
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
  overflow-y: auto;
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