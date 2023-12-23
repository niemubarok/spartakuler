<template>
  <video ref="videoRef" class="rounded-corner"></video>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import ls from "localstorage-slim";
import { useQuasar } from "quasar";
const $q = useQuasar();

// const cameraId = computed(ls.get("cameraIn").id);
const cameraId = ref(ls.get("cameraIn"));
const videoRef = ref(null);

watch(
  () => ls.get("cameraIn"),
  (newValue) => {
    cameraId.value = newValue;
  }
);
const video = ref(null);
const width = $q.screen.width <= 1366 ? "1280" : "720";
const height = $q.screen.height <= 1366 ? "720" : "1180";

onMounted(() => {
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
        // videoRef.value.style.width = "55vw";
        // videoRef.value.style.height = "62vh";
        .catch(function (error) {
          console.error("Error accessing video stream: ", error);
        });
    }
  }
});
</script>
