<template>
  <div class="camera-container">
    <q-chip
        v-if="label"
        style="border-radius:8px; top: 0px; left: 0px; font-size:medium; background-color: rgba(0, 0, 0, 0.5);"
        class="text-white absolute inset-shadow"
        :label="label"
      />
    <div class="connection-indicator" :class="{ 'connected': cameraStatus }">
      <div class="indicator-dot"></div>
    </div>

    <div v-if="cameraType === 'usb'" class="rounded-corner camera-view">
      <video ref="videoRef" class="rounded-corner"></video>
    </div>
    <div v-else-if="cameraType === 'manual' && imageSrc" class="camera-view">
      <img
        :src="imageSrc"
        alt="Manual image"
        @error="(e) => { 
          console.error('Image load error:', e);
          message = 'Invalid image data'; 
          cameraStatus = false;
        }"
      />
      <span class="text-red">{{message}}</span>
    </div>
    <div v-else-if="cameraType === 'cctv'" class="camera-view">
      <q-skeleton class="full-height">
        <template v-slot:default>
          <div class="absolute-center text-center text-grey-7">
            <q-icon name="camera_alt" size="xl" />
            <div>{{ message }}</div>
          </div>
        </template>
      </q-skeleton>
    </div>
    <div v-else class="camera-view">
      <img
        :src="imageSrc"
        alt="Manual image"
        @error="(e) => { 
          console.error('Image load error:', e);
          message = 'Invalid image data'; 
          cameraStatus = false;
        }"
      />
      <span class="text-red">{{message}}</span>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, onUnmounted, computed } from "vue";
import ls from "localstorage-slim";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api, axios } from "src/boot/axios";

const $q = useQuasar();
const router = useRouter();
const imageSrc = ref(null);
const cameraStatus = ref(true);
const videoRef = ref(null);
const stream = ref(null);
const message = ref("Loading Image...");
const isServerConnected = ref(true);
const connectionCheckInterval = ref(null);
const intervalId = ref(null);

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
    default: 'default',
  },
  label: {
    type: String,
    default: '',
  },
  manualBase64: {
    type: String,
    default: '',
  },
  cropArea: Object
});

const retryCount = ref(0);
const maxRetries = 3;
const retryDelay = 2000; // 2 seconds
const notFoundCount = ref(0);

// Update the computed cameraDeviceId
const cameraDeviceId = computed(() => {
  switch (props.cameraLocation) {
    case 'plate':
      return ls.get('plateCameraDevice')
    case 'driver':
      return ls.get('driverCameraDevice')
    case 'scanner':
      return ls.get('scannerCameraDevice')
    default:
      return undefined
  }
})

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
    let imageFile;

    if (props.cameraType === 'usb') {
      // Capture from USB camera
      if (!videoRef.value || !videoRef.value.srcObject) {
        throw new Error('Camera not initialized');
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.value.videoWidth;
      canvas.height = videoRef.value.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(videoRef.value, 0, 0);
      
      // Convert canvas to Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });
      
      // Create a File object from the blob
      imageFile = new File([blob], 'plate.jpg', { type: 'image/jpeg' });
    } else if (props.cameraType === 'manual') {
      // Handle manual image
      if (!imageSrc.value) {
        throw new Error('No manual image available');
      }
      const base64Data = imageSrc.value.split(',')[1]; // Remove data:image/xyz prefix
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      imageFile = new File([blob], 'plate.jpg', { type: 'image/jpeg' });

      // Apply cropping if cropArea is provided
      if (props.cropArea) {
        imageFile = await cropImageFromFile(imageFile, props.cropArea);
      }
    } else {
      // Capture from CCTV
      const image = await api.get(`/cctv/snapshot?fileName=${props.fileName}&cctv_url=${props.cameraUrl}`);
      if (image.data.isSuccess) {
        // Convert base64 to Blob
        const base64Response = await fetch(`data:image/jpeg;base64,${image.data.base64}`);
        const blob = await base64Response.blob();
        imageFile = new File([blob], 'plate.jpg', { type: 'image/jpeg' });
      } else {
        throw new Error(image.data.message || 'Failed to capture CCTV image');
      }
    }

    // Crop the image if cropArea is provided
    if (props.cropArea) {
      const croppedImage = await cropImageFromFile(imageFile, props.cropArea);
      return croppedImage;
    }

    return imageFile;
  } catch (error) {
    console.error('Error capturing image:', error);
    emit('error', error);
    throw error;
  }
};

// Helper function to crop an image file
const cropImageFromFile = (file, cropArea) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error('Failed to crop image'));
          }
        }, file.type);
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fetchCameraImage = async () => {
  try {
    if (router.currentRoute.value.path !== "/") {
      return;
    }

    // Gunakan URL langsung untuk mengambil gambar dari CCTV
    const response = await axios.get(props.cameraUrl, {
      responseType: 'arraybuffer', // Pastikan response berupa binary data
      headers: {
        Authorization: `Basic ${btoa('admin:Hiks2024')}`, // Ganti dengan username dan password Anda
      },
    });
    console.log("🚀 ~ fetchCameraImage ~ response:", response)

    if (response.status === 200) {
      // Konversi array buffer ke base64
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      imageSrc.value = `data:image/jpeg;base64,${base64}`;
      message.value = '';
      retryCount.value = 0;
      notFoundCount.value = 0;
    } else {
      throw new Error('Failed to capture image from CCTV');
    }
  } catch (error) {
    ++notFoundCount.value;
    if (error.code === 'ERR_NETWORK' && retryCount.value < maxRetries) {
      message.value = `Connection lost. Retrying... (${retryCount.value + 1}/${maxRetries})`;
      retryCount.value++;
      setTimeout(fetchCameraImage, retryDelay);
    } else if (notFoundCount.value >= 5) {
      clearInterval(intervalId);
      cameraStatus.value = false;
      message.value = 'Camera connection failed';
      emit('error', error);
    }
  }
};

const setManualBase64 = async (base64String) => {
  try {
    if (!base64String) {
      throw new Error('Base64 string is empty');
    }

    // Check if base64 string already has a prefix
    let fullBase64 = base64String.startsWith('data:image') 
      ? base64String 
      : `data:image/jpeg;base64,${base64String}`;

    // Create an image element to apply cropping
    const image = new Image();
    image.src = fullBase64;

    image.onload = async () => {
      if (props.cropArea) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = props.cropArea.width;
        canvas.height = props.cropArea.height;

        ctx.drawImage(
          image,
          props.cropArea.x,
          props.cropArea.y,
          props.cropArea.width,
          props.cropArea.height,
          0,
          0,
          props.cropArea.width,
          props.cropArea.height
        );

        // Convert cropped canvas to base64
        fullBase64 = canvas.toDataURL('image/jpeg');
      }

      imageSrc.value = fullBase64;
      message.value = '';
      cameraStatus.value = true;
    };

    image.onerror = () => {
      throw new Error('Failed to load manual image');
    };
  } catch (error) {
    console.error('Error setting manual image:', error);
    message.value = 'Invalid image data';
    cameraStatus.value = false;
  }
};

watch(() => props.manualBase64, (newValue) => {
  console.log("Manual base64 changed:", newValue ? newValue.substring(0, 50) + '...' : 'empty')
  if (newValue) {
    setManualBase64(newValue)
  }
}, { immediate: true });

// Update initialization logic
onMounted(async () => {

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
  getImage,
  setManualBase64
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
