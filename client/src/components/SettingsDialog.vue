<template>
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
    no-esc-dismiss
    maximized
    @hide="onDialogHide"
    persistent
  >
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
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="camera" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Kamera Masuk</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">{{
                  componentStore.camera.in?.label || "-"
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" style="width: 60px" color="black"
                >i</q-btn
              >
              <!-- <q-icon name="star" color="yellow" /> -->
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="camera" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Kamera Keluar</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">{{
                  componentStore.camera.out?.label || "-"
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn push text-color="white" style="width: 60px" color="black"
                >O</q-btn
              >
              <!-- <q-icon name="star" color="yellow" /> -->
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section avatar>
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
              <q-btn push text-color="white" style="width: 60px" color="black"
                >P</q-btn
              >
            </q-item-section>
          </q-item>
        </div>
        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section avatar>
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
              <q-btn push text-color="white" style="width: 60px" color="black"
                >J</q-btn
              >
            </q-item-section>
          </q-item>
        </div>

        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                icon="directions_car"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Default Kode Plat Nomor</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-h6 text-weight-bolder text-black">
                  {{ settingsStore.prefix || "-" }}
                </span>
              </q-item-label>
            </q-item-section>
            <!-- <q-item-section side>
              <q-btn push text-color="white" style="width: 60px" color="black"
                >K</q-btn
              >
            </q-item-section> -->
          </q-item>
        </div>

        <q-card-actions align="right">
          <q-chip
            text-color="primary"
            label="Simpan"
            style="padding: 2rem 1rem"
            class="q-mt-lg q-pa-md text-h6 rounded-corner"
          >
            <q-btn push icon="keyboard_return" color="black" class="q-ma-md"
          /></q-chip>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="componentStore.selectCameraInDialogModel" persistent>
      <select-camera-in-dialog />
    </q-dialog>
    <q-dialog v-model="componentStore.selectCameraOutDialogModel" persistent>
      <select-camera-out-dialog />
    </q-dialog>
    <q-dialog v-model="componentStore.selectPosDialogModel" persistent>
      <select-pos-dialog />
    </q-dialog>
    <q-dialog
      v-model="componentStore.selectDefaultJenisKendaraanDialogModel"
      persistent
    >
      <select-default-jenis-kendaraan-dialog />
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import {
  onMounted,
  computed,
  onBeforeMount,
  ref,
  onUpdated,
  onUnmounted,
} from "vue";
import { useComponentStore } from "src/stores/component-store";
import { useSettingsStore } from "src/stores/settings-store";
import { useTransaksiStore } from "src/stores/transaksi-store";
import LoginDialog from "src/components/LoginDialog.vue";

import ls from "localstorage-slim";
import SelectCameraInDialog from "./SelectCameraInDialog.vue";
import SelectCameraOutDialog from "./SelectCameraOutDialog.vue";
import SelectPosDialog from "./SelectPosDialog.vue";
import SelectDefaultJenisKendaraanDialog from "./SelectDefaultJenisKendaraanDialog.vue";

const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();
const settingsStore = useSettingsStore();

// ls.config.encrypt = false;

const $q = useQuasar();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();

const onSaveSettings = () => {
  dialogRef.value.hide();
  window.location.reload();
};

const handleKeyDownOnSettingDialog = async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    onSaveSettings();
  } else if (event.key.toUpperCase() === "I") {
    // const cameraInDialog = $q.dialog({
    //   component: SelectCameraInDialog,
    // });
    // cameraInDialog.update();
    event.preventDefault();
    componentStore.selectCameraInDialogModel = true;
  } else if (event.key.toUpperCase() === "O") {
    // const cameraOutDialog = $q.dialog({
    //   component: SelectCameraOutDialog,
    // });
    // cameraOutDialog.update();
    event.preventDefault();
    componentStore.selectCameraOutDialogModel = true;
  } else if (event.key.toUpperCase() === "P") {
    event.preventDefault();
    // const posDialog = $q.dialog({
    //   component: SelectPosDialog,
    // });
    // posDialog.update();
    componentStore.selectPosDialogModel = true;
  } else if (event.key.toUpperCase() === "J") {
    // const defaultJenisKendaraan = $q.dialog({
    //   component: SelectDefaultJenisKendaraanDialog,
    // });
    // defaultJenisKendaraan.update();
    event.preventDefault();
    componentStore.selectDefaultJenisKendaraanDialogModel = true;
  } else if (event.key === "Escape") {
    if (
      !componentStore.selectCameraInDialogModel &&
      !componentStore.selectCameraOutDialogModel &&
      !componentStore.selectPosDialogModel &&
      !componentStore.selectDefaultJenisKendaraanDialogModel
    ) {
      event.preventDefault();
      dialogRef.value.hide();
    }
  }
};

onMounted(async () => {
  await settingsStore.getPosConfig();
  window.addEventListener("keydown", handleKeyDownOnSettingDialog);
});

const onDialogHide = () => {
  if (transaksiStore.lokasiPos === "-" || transaksiStore.lokasiPos === null) {
    dialogRef.value.show();
    $q.notify({
      type: "negative",
      message: "Silahkan pilih lokasi terlebih dahulu",
      position: "center",
    });
  } else {
    window.removeEventListener("keydown", handleKeyDownOnSettingDialog);
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

// const isSubOpen = ref(false);
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
