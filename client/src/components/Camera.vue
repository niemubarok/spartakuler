<template>
  <div class="camera-container">
    <div class="connection-indicator" :class="{ 'connected': cameraStatus }">
      <div class="indicator-dot"></div>
    </div>

    <div v-if="cameraType === 'usb'" class="rounded-corner camera-view">
      <video ref="videoRef"></video>
    </div>
    <div v-else-if="imageSrc" class="camera-view">
      <img
        :src="imageSrc"
        alt="Camera Snapshot"
      />
    </div>
    <div v-else class="camera-view">
      <q-skeleton class="full-height">
        <template v-slot:default>
          <div class="absolute-center text-center text-grey-7">
            <q-icon name="camera_alt" size="xl" />
            <div>{{ message }}</div>
          </div>
        </template>
      </q-skeleton>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, onUnmounted, defineExpose, computed } from "vue";
import ls from "localstorage-slim";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";

const $q = useQuasar();
const router = useRouter();
const imageSrc = ref(null);
const cameraStatus = ref(true);
const videoRef = ref(null);
const stream = ref(null);
const message = ref("Loading Image...");
const isServerConnected = ref(true);

const emit = defineEmits(['captured', 'error']);

const props = defineProps({
  cameraLocation: String,
  cameraUrl: String,
  fileName: String,
  isInterval: {
    type: Boolean,
    default: true,
  },
  cameraType: {
    type: String,
    default: 'cctv',
  }
});

const retryCount = ref(0);
const maxRetries = 3;
const retryDelay = 2000; // 2 seconds

// Get the configured camera device ID based on location
const cameraDeviceId = computed(() => {
  const location = props.cameraLocation === 'plate' ? 'plateCameraDevice' : 'driverCameraDevice';
  return ls.get(location);
});

// Update USB camera initialization to use specific device
const initUsbCamera = async (deviceId) => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined
      }
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      videoRef.value.play();
    }
    message.value = '';
  } catch (error) {
    message.value = 'Cannot access USB camera';
    console.error('Error accessing USB camera:', error);
    emit('error', error);
  }
};

// Method to get image from either USB or CCTV camera
const getImage = async () => {
  try {
    if (props.cameraType === 'usb') {
      // Capture from USB camera
      if (!videoRef.value || !videoRef.value.srcObject) {
        throw new Error('Camera not initialized');
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.value.videoWidth;
      canvas.height = videoRef.value.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.value, 0, 0);
      
      // Convert canvas to Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });
      
      // Create a File object from the blob
      return new File([blob], 'plate.jpg', { type: 'image/jpeg' });
    } else {
      // Capture from CCTV
      const image = await api.get(`/cctv/snapshot?fileName=${props.fileName}&cctv_url=${props.cameraUrl}`);
      if (image.data.isSuccess) {
        // Convert base64 to Blob
        const base64Response = await fetch(`data:image/jpeg;base64,${image.data.base64}`);
        const blob = await base64Response.blob();
        return new File([blob], 'plate.jpg', { type: 'image/jpeg' });
      } else {
        throw new Error(image.data.message || 'Failed to capture CCTV image');
      }
    }
  } catch (error) {
    console.error('Error capturing image:', error);
    emit('error', error);
    throw error;
  }
};

// Function to check server connection

const fetchCameraImage = async () => {
  try {
    if (router.currentRoute.value.path !== "/") {
      return;
    }

    const image = await api.get(`/cctv/snapshot?fileName=${props.fileName}&cctv_url=${props.cameraUrl}`);
    if (image.data.isSuccess) {
      imageSrc.value = image.data.base64;
      message.value = '';
      retryCount.value = 0;
      notFoundCount = 0;
    } else {
      throw new Error(image.data.message || 'Failed to capture image');
    }
  } catch (error) {
    ++notFoundCount;
    if (error.code === 'ERR_NETWORK' && retryCount.value < maxRetries) {
      message.value = `Connection lost. Retrying... (${retryCount.value + 1}/${maxRetries})`;
      retryCount.value++;
      setTimeout(fetchCameraImage, retryDelay);
    } else if (notFoundCount >= 5) {
      clearInterval(intervalId);
      cameraStatus.value = false;
      message.value = 'Camera connection failed';
      emit('error', error);
    }
  }
};

// Update initialization logic
onMounted(async () => {
  // Initial connection check

  if (props.cameraType === 'usb') {
    try {
      if (cameraDeviceId.value) {
        await initUsbCamera(cameraDeviceId.value);
      }
    } catch (error) {
      console.error('Error initializing camera:', error);
      message.value = 'Cannot access camera. Please check permissions.';
      emit('error', error);
    }
    return;
  }

  // CCTV camera logic
  const interval = ls.get("interval") || 5000;
  let notFoundCount = 0;
  let intervalId;

  if (props.isInterval) {
    intervalId = setInterval(fetchCameraImage, interval);
  } else {
    await fetchCameraImage();
  }

  onUnmounted(() => {
    clearInterval(connectionCheckInterval);
    if (intervalId) clearInterval(intervalId);
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop());
    }
  });
});

onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
});

// Expose the getImage method to parent components
defineExpose({
  getImage
});
</script>

<style scoped>
.camera-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.camera-view {
  width: 100%;
  height: 50dvh;
  overflow: hidden;
  border-radius: 8px;
}

.camera-view video,
.camera-view img,
.camera-view .q-skeleton {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rounded-corner {
  border-radius: 10px;
  overflow: hidden;
}

.connection-indicators {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.connection-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff4444;
  box-shadow: 0 0 8px #ff4444;
  transition: all 0.3s ease;
}

.connected .indicator-dot {
  background-color: #44ff44;
  box-shadow: 0 0 8px #44ff44;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(68, 255, 68, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(68, 255, 68, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(68, 255, 68, 0);
  }
}
</style>
