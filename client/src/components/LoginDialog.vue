<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-px-md q-pt-sm glass relative"
      style="width: 500px; height: fit-content"
    >
      <q-card-section>
        <q-input
          v-model="username"
          label="Username"
          dense
          outlined
          autofocus
          autocomplete="off"
          @keydown.enter="passwordInput.focus()"
        ></q-input>
        <!-- <q-form @submit="onSubmit"> -->
        <q-input
          ref="passwordInput"
          v-model="password"
          label="Password"
          dense
          outlined
          type="password"
          class="q-mt-md"
          autocomplete="new-password"
          @keydown.enter="onSubmit"
        ></q-input>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Login" type="submit" color="primary" />
        </q-card-actions>
        <!-- </q-form> -->
      </q-card-section>

      <!-- <q-card-actions align="right"> -->
      <!-- <q-btn flat label="Action 1" /> -->
      <!-- <q-btn flat label="Simpan" @click="onSaveSettings" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useComponentStore } from "src/stores/component-store";

import ls from "localstorage-slim";
import { useTransaksiStore } from "src/stores/transaksi-store";
import axios from "axios";
import { useRouter } from "vue-router";
import ApiUrlDialog from "./ApiUrlDialog.vue";

const { dialogRef, onDialogHide } = useDialogPluginComponent();
const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();

const router = useRouter();
const $q = useQuasar();

const username = ref("");
const password = ref("");
const shift = ref("S1");
const passwordInput = ref(null);

const determineShift = () => {
  const shift1Start = "07:00";
  const shift1End = "14:00";
  const shift2Start = "14:01";
  const shift2End = "21:00";
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (currentTime >= shift1Start && currentTime < shift1End) {
    shift.value = "S1";
  } else if (currentTime >= shift2Start && currentTime <= shift2End) {
    shift.value = "S2";
  } else {
    shift.value = "S3";
  }

  ls.set("shift", shift.value);
};

const onSubmit = async () => {
  try {
    const response = await axios.post(process.env.API_URL + "/user/login", {
      username: username.value,
      password: password.value,
    });

    console.log(response.data);
    determineShift();
    ls.set("pegawai", response.data);
    router.push("/outgate");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle 401 error here
      console.log("Invalid username or password");
      $q.notify({
        type: "negative",
        message: "Cek kembali username dan password anda",
        position: "top",
        timeout: 1000,
      });
    } else {
      // console.log(error);
      // $q.notify({
      //   type: "negative",
      //   message: "Internal server rrror",
      //   position: "top",
      //   timeout: 1000,
      // });
    }
  }
};

defineEmits([...useDialogPluginComponent.emits]);
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
  backdrop-filter: blur(10px);
}
</style>
