<template>
  <q-page class="column flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/logo.png"
      style="width: 40vw; height: 50%"
    />
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
import { defineComponent, onMounted } from "vue";
import LoginDialog from "src/components/LoginDialog.vue";
import ApiUrlDialog from "src/components/ApiUrlDialog.vue";

import SettingsDialog from "src/components/SettingsDialog.vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useQuasar } from "quasar";

const $q = useQuasar();

const transaksiStore = useTransaksiStore();

const onClickDemoPage = () => {
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

window.addEventListener("keydown", handleKeyDown);

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
  }
});

defineComponent({
  name: "IndexPage",
});
</script>
