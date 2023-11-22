<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss @hide="onDialogHide">
    <q-card
      class="q-px-md q-pt-sm glass relative"
      style="width: 500px; height: fit-content"
    >
      <div>
        <q-avatar
          size="40px"
          class="cursor-pointer z-top absolute-top-right q-ma-sm"
          text-color="grey-7"
          color="grey-5"
          icon="close"
          @click="dialogRef.hide()"
        />
      </div>
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
        <q-select
          v-model="cameraIn"
          :options="cameraInOptions"
          label="Pilih Kamera Masuk"
          filled
        />
      </div>
      <div class="q-mt-md">
        <q-select
          v-model="cameraOut"
          :options="cameraOutOptions"
          label="Pilih Kamera Keluar"
          filled
        />
      </div>
      <div class="q-mt-md">
        <q-select
          v-model="transaksiStore.lokasiPos"
          :options="postLocationOptions"
          label="Pilih Lokasi Pos"
          filled
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-chip class="glossy" :label="scope.opt.value" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Action 1" /> -->
        <q-btn flat label="Simpan" @click="onSaveSettings" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useComponentStore } from "src/stores/component-store";

import ls from "localstorage-slim";
import { useTransaksiStore } from "src/stores/transaksi-store";

const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();
// ls.config.encrypt = false;
const cameraIn = ref(ls.get("cameraIn")) || ref("");
const cameraOut = ref(ls.get("cameraOut")) || ref("");
const cameraOptions = ref(["-"]);

const cameraInOptions = ref(cameraOptions.value);
const cameraOutOptions = ref(cameraOptions.value);

const postLocationOptions = ref([]);

const getAvailableCameras = () => {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          cameraOptions.value.push({
            label: device.label,
            value: device.deviceId,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message);
    });
};

const onDialogHide = () => {
  if (transaksiStore.lokasiPos === "-" || transaksiStore.lokasiPos === null) {
    dialogRef.value.show();
    $q.notify({
      type: "negative",
      message: "Silahkan pilih lokasi terlebih dahulu",
      position: "center",
    });
  }
};
onMounted(async () => {
  // getAvailableCameras();
  postLocationOptions.value = await transaksiStore.getLokasiPos();

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(() => {
      getAvailableCameras();
    })
    .catch((error) => {
      // Camera permission denied or error occurred
      console.error("Error accessing camera: ", error);
    });
});

const onSaveSettings = () => {
  // componentStore.setCameraInKey();

  ls.set("cameraIn", cameraIn.value);
  ls.set("cameraOut", cameraOut.value);
  ls.set("lokasiPos", transaksiStore.lokasiPos);

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
