<template>
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
    no-esc-dismiss
    maximized
    @hide="onDialogHide"
    persistent
    :key="componentStore.settingsKey"
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

        <div class="row q-col-gutter-sm  justify-center">
          <div
            v-for="setting in settingItems"
            class="row" style="min-width:200px"
          
          >
            <setting-item
              :icon="setting.icon"
              :title="setting.title"
              :label="setting.label() || '-'"
              :shortcut="setting.shortcut"
            />

          </div>
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

    <q-dialog v-model="componentStore.selectJenisTarifDialogModel"  persistent>
      <select-jenis-tarif-dialog />
    </q-dialog>
    <q-dialog v-model="componentStore.selectCameraInDialogModel" @hide="onCameraInDialogHide" >
      <camera-in-url-dialog />
    </q-dialog>
    <q-dialog v-model="componentStore.selectCameraOutDialogModel" @hide="onCameraOutDialogHide" >
      <camera-out-url-dialog />
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
import ApiUrlDialog from "src/components/ApiUrlDialog.vue";

import ls from "localstorage-slim";
import SelectJenisTarifDialog from "./SelectJenisTarifDialog.vue";
import SelectCameraInDialog from "./SelectCameraInDialog.vue";
import SelectCameraOutDialog from "./SelectCameraOutDialog.vue";
import SelectPosDialog from "./SelectPosDialog.vue";
import SelectDefaultJenisKendaraanDialog from "./SelectDefaultJenisKendaraanDialog.vue";
import SettingItem from "./SettingItem.vue"
import CameraInUrlDialog from "./CameraInUrlDialog.vue";
import CameraOutUrlDialog from "./CameraOutUrlDialog.vue";

const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();
const settingsStore = useSettingsStore();

// ls.config.encrypt = false;

const $q = useQuasar();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();


const settingItems = [
  { icon: "money", title: "Tarif Otomatis / Manual", shortcut: "T", label: ()=> componentStore.jenisTarif },
  { icon: "camera", title: "URL Kamera Masuk", shortcut: "i", label: ()=> settingsStore.cameraInUrl },
  { icon: "camera", title: "URL Kamera Keluar", shortcut: "O", label: ()=> settingsStore.cameraOutUrl },
  // { icon: "camera", title: "Kamera Keluar", shortcut: "o", label: ()=> componentStore.camera.out?.label },
  { icon: "place", title: "Lokasi Pos", shortcut: "p", label: ()=> transaksiStore.lokasiPos?.label },
  { icon: "directions_car", title: "Jenis Kendaraan", shortcut: "J", label: ()=> transaksiStore.defaultJenisKendaraan?.label },
  { icon: "event", title: "Kode Plat Nomor", shortcut: "k", label: ()=> settingsStore.prefix },
  { icon: "http", title: "API URL", shortcut: "U", label: ()=> ls.get("API_URL") },
];

const onSaveSettings = () => {
  dialogRef.value.hide();
  window.location.reload();
};


const onCameraInDialogHide = () => {
  // window.location.reload();
  window.addEventListener("keydown", handleKeyDownOnSettingDialog);
};
const onCameraOutDialogHide = () => {
  // window.location.reload();
  window.addEventListener("keydown", handleKeyDownOnSettingDialog);
};

const handleKeyDownOnSettingDialog = async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    onSaveSettings();
  }else if (event.key.toUpperCase() === "T") {
    event.preventDefault();
    // const posDialog = $q.dialog({
    //   component: SelectPosDialog,
    // });
    // posDialog.update();
    componentStore.selectJenisTarifDialogModel = true;
  } else if (event.key.toUpperCase() === "I") {
    event.preventDefault();
    // const cameraInDialog = $q.dialog({
    //   component: CameraInUrlDialog,
    // });
    // cameraInDialog.update();
    componentStore.selectCameraInDialogModel = true;
    window.removeEventListener("keydown", handleKeyDownOnSettingDialog);
  } else if (event.key.toUpperCase() === "O") {
    // const cameraOutDialog = $q.dialog({
    //   component: SelectCameraOutDialog,
    // });
    // cameraOutDialog.update();
    event.preventDefault();
    componentStore.selectCameraOutDialogModel = true;
    window.removeEventListener("keydown", handleKeyDownOnSettingDialog);
  } else if (event.key.toUpperCase() === "P") {
    event.preventDefault();
    // const posDialog = $q.dialog({
    //   component: SelectPosDialog,
    // });
    // posDialog.update();
    componentStore.selectPosDialogModel = true;
  } else if (event.key.toUpperCase() === "U") {
    event.preventDefault();
    const ApiDialog = $q.dialog({
       component: ApiUrlDialog,
     });
     ApiDialog.update();
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
  // componentStore.settingsKey = true;
});

// onUpdated(() => {
//   console.log("settings updated");
// });

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
