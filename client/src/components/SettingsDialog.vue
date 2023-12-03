<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss maximized @hide="onDialogHide">
    <div class="row justify-center items-center">
      <q-card
        class="q-px-md q-pt-sm q-pb-md glass relative"
        style="width: 90vw; height: fit-content"
      >
        <!-- <div>
          <q-avatar
            size="40px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-7"
            color="grey-5"
            icon="close"
            @click="dialogRef.hide()"
          />
        </div> -->
        <!-- <q-icon name="close"  /> -->
        <q-item>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              style="margin-left: -20px"
              class="q-mt-xs text-weight-bolder"
              >Pengaturan Parkir</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-separator inset />

        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="camera" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Kamera Masuk</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">{{
                  componentStore.camera.in.label || "-"
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" color="black">shift + i</q-btn>
              <!-- <q-icon name="star" color="yellow" /> -->
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="camera" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Kamera Keluar</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">{{
                  componentStore.camera.out.label || "-"
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" color="black">shift + O</q-btn>
              <!-- <q-icon name="star" color="yellow" /> -->
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="place" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Lokasi Pos</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">{{
                  transaksiStore.lokasiPos.label || "-"
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" color="black">shift + P</q-btn>
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section top avatar>
              <q-avatar
                color="primary"
                text-color="white"
                icon="directions_car"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Default Jenis Kendaraan</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">
                  {{ transaksiStore.defaultJenisKendaraan.label || "-" }}
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" color="black">shift + J</q-btn>
            </q-item-section>
          </q-item>
        </div>

        <q-card-actions align="right">
          <q-chip
            text-color="primary"
            label="Simpan"
            class="q-pa-md q-py-lg text-h6 rounded-corner"
          >
            <q-btn push icon="keyboard_return" color="black" class="q-ma-md"
          /></q-chip>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, computed, onBeforeMount, ref } from "vue";
import { useComponentStore } from "src/stores/component-store";

import ls from "localstorage-slim";
import { useTransaksiStore } from "src/stores/transaksi-store";
import SelectCameraInDialog from "./SelectCameraInDialog.vue";
import SelectCameraOutDialog from "./SelectCameraOutDialog.vue";
import SelectPosDialog from "./SelectPosDialog.vue";
import SelectDefaultJenisKendaraanDialog from "./SelectDefaultJenisKendaraanDialog.vue";

const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();
// ls.config.encrypt = false;
// const cameraIn = computed(() => ls.get("cameraIn"));
// const cameraOut = ref(ls.get("cameraOut")) || ref("");
// const cameraOptions = ref(["-"]);

// // const cameraInOptions = ref(cameraOptions.value);
// // const cameraOutOptions = ref(cameraOptions.value);

// const postLocationOptions = ref([]);
// const jenisKendaraanOptions = ref([]);

const $q = useQuasar();

// const getAvailableCameras = () => {
//   navigator.mediaDevices
//     .enumerateDevices()
//     .then((devices) => {
//       devices.forEach((device) => {
//         if (device.kind === "videoinput") {
//           cameraOptions.value.push({
//             label: device.label,
//             value: device.deviceId,
//           });
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err.name + ": " + err.message);
//     });
// };

const onDialogHide = () => {
  if (transaksiStore.lokasiPos === "-" || transaksiStore.lokasiPos === null) {
    dialogRef.value.show();
    $q.notify({
      type: "negative",
      message: "Silahkan pilih lokasi terlebih dahulu",
      position: "center",
    });
  }
  // else if (transaksiStore.API_URL === "-") {
  //   dialogRef.value.show();
  //   $q.notify({
  //     type: "negative",
  //     message: "Silahkan Isi URL API terlebih dahulu",
  //     position: "center",
  //   });
  // }
};
onMounted(async () => {
  // getAvailableCameras();
  // postLocationOptions.value = await transaksiStore.getLokasiPos();
  // jenisKendaraanOptions.value = await transaksiStore.getJenisKendaraan();

  // navigator.mediaDevices
  //   .getUserMedia({ video: true })
  //   .then(() => {
  //     getAvailableCameras();
  //   })
  //   .catch((error) => {
  //     // Camera permission denied or error occurred
  //     console.error("Error accessing camera: ", error);
  //   });

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      onSaveSettings();
    } else if (event.shiftKey && event.key === "I") {
      const cameraInDialog = $q.dialog({
        component: SelectCameraInDialog,
      });
      cameraInDialog.update();
    } else if (event.shiftKey && event.key === "O") {
      const cameraOutDialog = $q.dialog({
        component: SelectCameraOutDialog,
      });
      cameraOutDialog.update();
    } else if (event.shiftKey && event.key === "P") {
      const posDialog = $q.dialog({
        component: SelectPosDialog,
      });
      posDialog.update();
    } else if (event.shiftKey && event.key === "J") {
      const defaultJenisKendaraan = $q.dialog({
        component: SelectDefaultJenisKendaraanDialog,
      });
      defaultJenisKendaraan.update();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
});

const onSaveSettings = () => {
  // componentStore.setCameraInKey();

  // ls.set("cameraIn", cameraIn.value);
  // ls.set("cameraOut", cameraOut.value);
  // ls.set("lokasiPos", transaksiStore.lokasiPos);
  ls.set("API_URL", transaksiStore.API_URL);
  // ls.set("defaultJenisKendaraan", transaksiStore.defaultJenisKendaraan);

  dialogRef.value.hide();
  window.location.reload();
};

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();
</script>

<style scoped>
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.378);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
}

:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(30px);
}
</style>
