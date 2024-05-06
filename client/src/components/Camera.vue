<template>
  <!-- <video ref="videoRef" class="rounded-corner"></video> -->
  <div v-if="imageSrc">
  <img 
    :src="imageSrc" 
    alt="Camera Snapshot" 
    style="width: 49vw; height: 52vh;border-radius: 10px;" 
  />
  </div>
  <div v-else>
    <q-skeleton
      height="52vh"
      class="rounded-corner"
      width="49vw"
    >
      <template v-slot:default>
        <div class="absolute-center text-center text-grey-7">
          <q-icon name="camera_alt" size="xl" />
          <!-- <div>{{cameraStatus ? 'Loading Camera...' : 'Tidak Ada Kamera'}}</div> -->
          <div>{{message}}</div>
        </div>
      </template>
    </q-skeleton>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import ls from "localstorage-slim";
import { useQuasar } from "quasar";
const $q = useQuasar();
import {api} from 'src/boot/axios'
const imageSrc = ref(null);
const cameraStatus = ref(true)
// const cameraId = ref(
//   "http://10.40.38.54:80/ISAPI/Streaming/channels/1/picture"
// );
const props = defineProps({
  cameraLocation: String,
  cameraUrl: String,
  fileName: String,
  isInterval: {
    type: Boolean,
    default: true
  }
})

const message = ref("Loading Image...");
onMounted(async () => {
  // const cameraUrl = ls.get("cameraInUrl")
  // const filename = `tes.png`
  const interval = ls.get("interval") || 5000
  let notFoundCount = 0;
  // const isInterval = true; // tambahkan variable ini
  let intervalId;
  if (props.isInterval) {
    intervalId = setInterval(async () => {
      try {
        const image = await api.get(`/cctv/snapshot?fileName=${props.fileName}
        &cctv_url=${props.cameraUrl}`);
        console.log(image);
        if (image.data.isSuccess) {
          imageSrc.value = image.data.base64;
          notFoundCount = 0;
        } else {
          message.value = image.data.message;
          ++notFoundCount;
          if (notFoundCount >= 5) {
            clearInterval(intervalId);
            cameraStatus.value = false
          }
        }
      } catch (error) {
        ++notFoundCount;
        if (notFoundCount >= 5) {
          clearInterval(intervalId);
          cameraStatus.value = false
        }
      }
    }, interval);
  } else {
    try {
      const image = await api.get(`/cctv/snapshot?fileName=${props.fileName}
      &cctv_url=${props.cameraUrl}`);
      console.log(image);
      if (image.data.isSuccess) {
        imageSrc.value = image.data.base64;
        notFoundCount = 0;
      } else {
        message.value = image.data.message;
      }
    } catch (error) {
      cameraStatus.value = false
    }
  }
  
})

</script>
