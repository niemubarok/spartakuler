<template>
  <video ref="videoRef" autoplay></video>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ls from "localstorage-slim";
import { useTransaksiStore } from "src/stores/transaksi-store";

// const cameraId = ref(ls.get("cameraOut").id);
const cameraId = ref(ls.get("cameraOut"));
const videoRef = ref(null);

onMounted(() => {
  if (cameraId.value.value) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: cameraId.value.value } })
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
