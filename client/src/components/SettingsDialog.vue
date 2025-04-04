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

        <!-- General Settings Section -->
        <div class="text-h6 q-mb-md">General Settings</div>
        <div class="q-pa-md">
          <!-- Backend URL Settings -->
          <div class="q-mb-md">
            <div class="text-subtitle1 q-mb-sm">Backend Settings</div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input
                  v-model="backendUrl"
                  label="Backend URL"
                  @update:model-value="updateBackendUrl"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="alprUrl"
                  label="ALPR Service URL"
                  @update:model-value="updateAlprUrl"
                />
              </div>
            </div>
          </div>

          <!-- Parking Location Settings -->
          <div class="q-mb-md">
            <div class="text-subtitle1 q-mb-sm">Parking Location</div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-select
                  v-model="selectedLocation"
                  :options="parkingLocations"
                  label="Location"
                  option-label="label"
                  emit-value
                  map-options
                  @update:model-value="updateLocation"
                />
              </div>
            </div>
          </div>

          <!-- Mode Selection -->
          <div class="q-mb-md">
            <div class="text-subtitle1 q-mb-sm">Operation Mode</div>
            <q-toggle
              v-model="manlessMode"
              label="Enable Manless Mode"
              color="primary"
              @change="switchManlessMode"
            />
            <q-toggle
              v-model="enableExitGateMode"
              label="Enable Exit Gate Mode"
              color="primary"
              @change="switchGateModeMode"
            />
          </div>
        </div>

        <q-separator spaced />

        <!-- Mode Specific Settings -->
        <div v-if="manlessMode">
          <!-- Manless Mode Settings -->
          <div class="text-h6 q-mb-md">Manless Mode Settings</div>
          <div class="q-pa-md">
            <!-- Camera Settings -->
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">Camera Settings</div>
              
              <!-- License Plate Camera -->
              <div class="q-mb-md">
                <div class="text-caption q-mb-sm">License Plate Camera</div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-select
                      v-model="selectedPlateCam"
                      :options="cameras"
                      label="USB Camera"
                      option-value="deviceId"
                      option-label="label"
                      clearable
                      emit-value
                      map-options
                      @update:model-value="updatePlateCamera"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="plateCameraUrl" 
                      label="CCTV URL"
                      @update:model-value="updatePlateCameraUrl"
                    />
                  </div>
                </div>
              </div>
        
              <!-- Driver Camera -->
              <div class="q-mb-md">
                <div class="text-caption q-mb-sm">Driver Camera</div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-select
                      v-model="selectedDriverCam"
                      :options="cameras"
                      label="USB Camera"
                      option-value="deviceId"
                      option-label="label"
                      clearable
                      emit-value
                      map-options
                      @update:model-value="updateDriverCamera"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="driverCameraUrl"
                      label="CCTV URL"
                      @update:model-value="updateDriverCameraUrl"
                    />
                  </div>
                </div>
              </div>

              <!-- QR Scanner Camera -->
              <div class="q-mb-md">
                <div class="text-caption q-mb-sm">QR Scanner Camera</div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-select
                      v-model="selectedScannerCam"
                      :options="cameras"
                      label="USB Camera"
                      option-value="deviceId"
                      option-label="label"
                      clearable
                      emit-value
                      map-options
                      @update:model-value="updateScannerCamera"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="scannerCameraUrl"
                      label="CCTV URL"
                      @update:model-value="updateScannerCameraUrl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Manual Mode Settings -->
          <div class="text-h6 q-mb-md">Manual Mode Settings</div>
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm justify-center">
              <q-separator inset />
              <div v-for="setting in settingItems" class="row">
                <setting-item
                  :icon="setting.icon"
                  :title="setting.title"
                  :label="setting.label() || '-'"
                  :shortcut="setting.shortcut"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card-actions align="right">
          <q-chip
            text-color="primary"
            label="Simpan"
            style="padding: 2rem 1rem"
            class="q-mt-lg q-pa-md text-h6 rounded-corner"
          >
            <q-btn @click="onSaveSettings" push icon="keyboard_return" color="black" class="q-ma-md"
          /></q-chip>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="componentStore.selectJenisTarifDialogModel" persistent>
      <select-jenis-tarif-dialog />
    </q-dialog>
    <q-dialog
      v-model="componentStore.selectCameraInDialogModel"
      @hide="onCameraInDialogHide"
    >
      <camera-in-url-dialog />
    </q-dialog>
    <q-dialog
      v-model="componentStore.selectCameraOutDialogModel"
      @hide="onCameraOutDialogHide"
    >
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
  <q-dialog
    v-model="componentStore.selectSerialPortDialogModel"
    @hide="onSerialPortDialogHide"
  >
    <select-serial-port-dialog />
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
  watch,
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
import SelectSerialPortDialog from "./SelectSerialPortDialog.vue";
import SettingItem from "./SettingItem.vue";
import CameraInUrlDialog from "./CameraInUrlDialog.vue";
import CameraOutUrlDialog from "./CameraOutUrlDialog.vue";

const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();
const settingsStore = useSettingsStore();
const switchManlessMode = (val) => {
  manlessMode.value = val;
  ls.set("manlessMode", val);
  if (val) {
    getCameras();
  } else {
    window.addEventListener("keydown", handleKeyDownOnSettingDialog);
  }
};

const switchGateModeMode = (val) => {
  enableExitGateMode.value = val;
    ls.set("exitGateMode", val);
};

// ls.config.encrypt = false;

const $q = useQuasar();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();

const settingItems = [
  {
    icon: "money",
    title: "Tarif Otomatis / Manual",
    shortcut: "T",
    label: () => componentStore.jenisTarif,
  },

  // { icon: "camera", title: "Kamera Keluar", shortcut: "o", label: ()=> componentStore.camera.out?.label },
  {
    icon: "place",
    title: "Lokasi Pos",
    shortcut: "p",
    label: () => transaksiStore.lokasiPos?.label,
  },
  {
    icon: "directions_car",
    title: "Jenis Kendaraan",
    shortcut: "J",
    label: () => transaksiStore.defaultJenisKendaraan?.label,
  },
  {
    icon: "event",
    title: "Kode Plat Nomor",
    shortcut: "k",
    label: () => settingsStore.prefix,
  },
  {
    icon: "serial_port",
    title: "Serial Port",
    shortcut: "S",
    label: () => settingsStore.serialPort,
  },
  {
    icon: "http",
    title: "API URL",
    shortcut: "U",
    label: () => ls.get("API_URL"),
  },

  {
    icon: "camera",
    title: "URL Kamera Masuk",
    shortcut: "i",
    label: () => settingsStore.cameraInUrl,
  },
  {
    icon: "camera",
    title: "URL Kamera Keluar",
    shortcut: "O",
    label: () => settingsStore.cameraOutUrl,
  },
];

const manlessMode = ref(ls.get('manlessMode')||true)
const enableExitGateMode = ref(ls.get('exitGateMode')||false)
const plateCameraUrl = ref(ls.get('plateCameraUrl') || '')  
const driverCameraUrl = ref(ls.get('driverCameraUrl') || '')

const cameras = ref([])
const selectedPlateCam = ref(null)
const selectedDriverCam = ref(null)
const selectedScannerCam = ref(null)
const scannerCameraUrl = ref(ls.get('scannerCameraUrl') || '')

watch(manlessMode, async (val) => {
  ls.set('manlessMode', val)
  if(val) {
    await getCameras()
  }
  if(!val) {
    window.addEventListener("keydown", handleKeyDownOnSettingDialog);
  }
})
watch(enableExitGateMode, async (val) => {
  ls.set('exitGateMode', val)
})

watch(plateCameraUrl, (val) => {
  ls.set('plateCameraUrl', val)
})

watch(driverCameraUrl, (val) => {
  ls.set('driverCameraUrl', val)
})

watch(scannerCameraUrl, (val) => {
  ls.set('scannerCameraUrl', val)
})

const onSaveSettings = () => {
  dialogRef.value.hide();
  window.location.reload();
};

const onSerialPortDialogHide = () => {
  window.addEventListener("keydown", handleKeyDownOnSettingDialog);
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
  } else if (event.key.toUpperCase() === "T") {
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
  } else if (event.key.toUpperCase() === "S") {
    event.preventDefault();
    componentStore.selectSerialPortDialogModel = true;
    window.removeEventListener("keydown", handleKeyDownOnSettingDialog);
  }
};

const getCameras = async () => {
  try {
    console.log('Requesting camera permissions...');
    await navigator.mediaDevices.getUserMedia({ video: true });
    
    console.log('Enumerating devices...');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoCameras = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${cameras.value.length + 1}`,
        value: device.deviceId // Add value for q-select compatibility
      }));
    
    cameras.value = videoCameras;
    console.log('Available cameras:', cameras.value);
    
    // Restore saved camera selections
    const savedPlateCam = ls.get('plateCameraDevice');
    const savedDriverCam = ls.get('driverCameraDevice');
    const savedScannerCam = ls.get('scannerCameraDevice');
    
    if (savedPlateCam) {
      selectedPlateCam.value = savedPlateCam;
    }
    if (savedDriverCam) {
      selectedDriverCam.value = savedDriverCam;
    }
    if (savedScannerCam) {
      selectedScannerCam.value = savedScannerCam;
    }
  } catch (error) {
    console.error('Error getting cameras:', error);
    $q.notify({
      type: 'negative',
      message: 'Could not access camera. Please check permissions.',
      position: 'top'
    });
  }
};

const updatePlateCamera = (deviceId) => {
  if (deviceId) {
    ls.set('plateCameraDevice', deviceId)
    plateCameraUrl.value = '' // Clear URL if USB camera selected
    ls.set('plateCameraUrl', '')
  }
}

const updateDriverCamera = (deviceId) => {
  if (deviceId) {
    ls.set('driverCameraDevice', deviceId)
    driverCameraUrl.value = '' // Clear URL if USB camera selected
    ls.set('driverCameraUrl', '')
  }
}

const updateScannerCamera = (deviceId) => {
  if (deviceId) {
    ls.set('scannerCameraDevice', deviceId)
    scannerCameraUrl.value = '' // Clear URL if USB camera selected
    ls.set('scannerCameraUrl', '')
  }
}

const updatePlateCameraUrl = (url) => {
  if (url) {
    selectedPlateCam.value = null // Clear USB camera if URL entered
    ls.set('plateCameraDevice', null)
    ls.set('plateCameraUrl', url)
  }
}

const updateDriverCameraUrl = (url) => {
  if (url) {
    selectedDriverCam.value = null // Clear USB camera if URL entered
    ls.set('driverCameraDevice', null)
    ls.set('driverCameraUrl', url)
  }
}

const updateScannerCameraUrl = (url) => {
  if (url) {
    selectedScannerCam.value = null // Clear USB camera if URL entered
    ls.set('scannerCameraDevice', null)
    ls.set('scannerCameraUrl', url)
  }
}

const backendUrl = ref(ls.get('API_URL') || 'http://127.0.0.1:3333')
const alprUrl = ref(ls.get('ALPR_URL') || 'http://127.0.0.1:8000')
const selectedLocation = ref(null)
const parkingLocations = ref([])

const updateBackendUrl = (val) => {
  ls.set('API_URL', val)
}

const updateAlprUrl = (val) => {
  ls.set('ALPR_URL', val)
}

const updateLocation = (val) => {
  transaksiStore.lokasiPos = val
}

onMounted(async () => {
  await settingsStore.getPosConfig()
  if (manlessMode.value) {
    await getCameras()  
  }
  if (!manlessMode.value) {
    window.addEventListener("keydown", handleKeyDownOnSettingDialog)
  }
  
  // Set initial values
  backendUrl.value = ls.get('API_URL') || ''
  alprUrl.value = ls.get('ALPR_URL') || ''
  parkingLocations.value = await settingsStore.getLocations() || []
  selectedLocation.value = transaksiStore.lokasiPos
})

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
