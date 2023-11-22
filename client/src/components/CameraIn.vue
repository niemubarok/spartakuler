<template>
  <video ref="video" class="rounded-corner" autoplay></video>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ls from "localstorage-slim";

// const cameraId = ref(ls.get("cameraIn").id);
const cameraId = ref(ls.get("cameraIn"));
const video = ref(null);

onMounted(() => {
  if (cameraId.value.value) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: cameraId.value.value } })
        .then(function (stream) {
          video.value.srcObject = stream;
          video.value.play();
        })
        .catch(function (error) {
          console.error("Error accessing video stream: ", error);
        });
    }
  }
});
</script>
