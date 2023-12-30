<template>
  <video ref="videoRef" autoplay></video>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ls from "localstorage-slim";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useComponentStore } from "src/stores/component-store";
import { useQuasar } from "quasar";
const $q = useQuasar();
// const cameraId = ref(ls.get("cameraOut").id);
const cameraId = ref(ls.get("cameraOut"));
const videoRef = ref(null);
const props = defineProps({
  mode: {
    type: String,
    default: "potrait",
  },
});
const width = props.mode === "potrait" ? "1280" : "720";
const height = props.mode === "potrait" ? "720" : "1280";

onMounted(() => {
  console.log("mounted");
  if (cameraId.value.value) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          deviceId: cameraId.value.value,
          width: { ideal: width }, // Adjusted for portrait orientation
          height: { ideal: height }, // Adjusted for portrait orientation
          facingMode: "environment", // Optimal for IPCamera
          frameRate: { ideal: 60 }, // Higher frame rate for smoother video
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          videoRef.value.srcObject = stream;
          videoRef.value.play();
        })
        .catch(function (error) {
          console.error("Error accessing video stream: ", error);
        });
    }
  }
});

// onBeforeUnmount(() => {
//   // console.log("onBeforeUnmount");
//   if (videoRef.value) {
//     useComponentStore().stopCamera();
//   }
// });
</script>
