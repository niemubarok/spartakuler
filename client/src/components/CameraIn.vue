<template>
  <video ref="videoRef" class="rounded-corner"></video>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import ls from "localstorage-slim";

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

onMounted(() => {
  if (cameraId.value.value) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          deviceId: cameraId.value.value,
          width: { ideal: 720 }, // Adjusted for portrait orientation
          height: { ideal: 1280 }, // Adjusted for portrait orientation
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
</script>
