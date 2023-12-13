<template>
  <q-banner
    v-if="settingsStore.isLicenseExpired === true"
    class="full-width fixed-center z-top q-mt-xl bg-red-6"
    style="height: 60vh"
  >
    <q-item class="q-pa-md">
      <q-item-section avatar>
        <q-icon
          name="warning"
          size="xl"
          color="white"
          style="width: 20vw; transform: scale(1.7)"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h3 text-white text-weight-bolder">
          Lisensi Berakhir
        </q-item-label>
        <q-item-label caption>
          <span class="text-h4 text-white text-weight-bolder">
            Silahkan hubungi vendor
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-banner>
  <q-page v-else class="column flex flex-center">
    <!-- <template v-slot:action>
        <q-btn flat color="{3:white}" label="{4:Dismiss}" />
        <q-btn flat color="{5:white}" label="{6:Update Credit Card}" />
      </template> -->
    <Logo />
    <div class="q-gutter-md">
      <q-btn
        push
        style="width: 300px; height: 100px"
        color="primary"
        icon="directions_car"
        label="Post Masuk"
        @click="$router.push({ name: 'createTransaksi' })"
      >
        <q-btn
          push
          class="q-ma-md"
          color="white"
          text-color="primary"
          label="shift + i"
        />
      </q-btn>
      <!-- icon="directions_car" -->
      <q-btn
        push
        style="width: 300px; height: 100px"
        color="primary"
        icon="directions_car"
        label="Post Keluar"
        @click="onClickDemoPage()"
      >
        <q-btn
          push
          class="q-ma-md"
          color="white"
          text-color="primary"
          label="shift + O"
        />
      </q-btn>
      <q-btn
        push
        style="width: 300px; height: 100px"
        color="primary"
        icon="settings"
        label="Settings"
        @click="onClickSettings()"
      >
        <q-btn
          push
          class="q-ma-md"
          color="white"
          text-color="primary"
          label="shift + S"
        />
      </q-btn>
      <!-- @click="$router.push('/outgate')" -->
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, onBeforeMount, onMounted } from "vue";
import LoginDialog from "src/components/LoginDialog.vue";
import ApiUrlDialog from "src/components/ApiUrlDialog.vue";
import Logo from "src/components/Logo.vue";

import SettingsDialog from "src/components/SettingsDialog.vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useQuasar } from "quasar";
import { useSettingsStore } from "src/stores/settings-store";
import { onBeforeRouteLeave } from "vue-router";
import ls from "localstorage-slim";

const $q = useQuasar();

const transaksiStore = useTransaksiStore();
const settingsStore = useSettingsStore();

const onClickDemoPage = () => {
  if (ls.get("lokasiPos") === null) {
    $q.notify({
      type: "negative",
      message: "Silahkan Isi Lokasi POS terlebih dahulu di menu Settings",
      position: "top",
      timeout: 3000,
    });
    return;
  } else {
    const dialog = $q.dialog({
      component: LoginDialog,
      noBackdropDismiss: true,
      persistent: true,
      componentProps: {
        type: "login",
        url: "/outgate",
      },
    });
    dialog.update();
  }
};
const onClickSettings = () => {
  if (!transaksiStore.isAdmin) {
    const dialog = $q.dialog({
      component: LoginDialog,
      // noBackdropDismiss: true,
      // persistent: true,
      componentProps: {
        type: "check",
        component: "SettingsDialog",
      },
    });
    console.log(dialog);
    dialog.update();
  } else {
    const settingsDialog = $q.dialog({
      component: SettingsDialog,
      persistent: true,
      noEscDismiss: true,
    });

    settingsDialog.update();
  }
};

const handleKeyDown = (event) => {
  if (event.shiftKey && event.key === "O") {
    onClickDemoPage();
  } else if (event.shiftKey === true && event.key === "S") {
    event.preventDefault();
    onClickSettings();
  }
};

onMounted(async () => {
  // console.log(transaksiStore.API_URL);
  if (!transaksiStore.API_URL || transaksiStore.API_URL === "-") {
    const dialog = $q.dialog({
      component: ApiUrlDialog,
      noBackdropDismiss: true,
    });

    dialog.update();
    $q.notify({
      type: "negative",
      message: "Silahkan Isi URL API terlebih dahulu",
      position: "top",
    });
  } else {
    await useSettingsStore().loadSettings();

    if (settingsStore.isLicenseExpired === false) {
      window.addEventListener("keydown", handleKeyDown);
    }
  }
});

onBeforeRouteLeave(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

defineComponent({
  name: "IndexPage",
});
</script>
