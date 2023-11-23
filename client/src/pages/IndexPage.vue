<template>
  <q-page class="flex flex-center">
    <div class="column">
      <img
        alt="Quasar logo"
        src="~assets/logo.png"
        style="width: 40vw; height: 50%"
      />

      <q-btn
        color="primary"
        icon="directions_car"
        label="Demo Post Keluar"
        @click="onClickDemoPage()"
      />
      <!-- icon="directions_car" -->
      <q-btn
        color="primary"
        label="tes"
        class="q-ma-md"
        @click="$router.push('/transaksi/create')"
      />
      <!-- @click="$router.push('/outgate')" -->
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, onMounted } from "vue";
import LoginDialog from "src/components/LoginDialog.vue";
import ApiUrlDialog from "src/components/ApiUrlDialog.vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useQuasar } from "quasar";

const $q = useQuasar();

const transaksiStore = useTransaksiStore();

const onClickDemoPage = () => {
  const dialog = $q.dialog({
    component: LoginDialog,
    noBackdropDismiss: true,
    persistent: true,
  });
  dialog.update();
};

const handleKeyDown = (event) => {
  if (event.shiftKey && event.key === "D") {
    onClickDemoPage();
  }
};

window.addEventListener("keydown", handleKeyDown);

onMounted(async () => {
  console.log(transaksiStore.API_URL);
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
