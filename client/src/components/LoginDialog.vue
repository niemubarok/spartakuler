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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useComponentStore } from "src/stores/component-store";
import SettingsDialog from "src/components/SettingsDialog.vue";
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
const props = defineProps({
  type: String,
  url: String,
  component: String,
});

const username = ref("");
const password = ref("");
const shift = ref("S1");
const passwordInput = ref(null);

defineEmits([...useDialogPluginComponent.emits]);

const determineShift = () => {
  const shift1Start = "07:00";
  const shift1End = "14:00";
  const shift2Start = "14:01";
  const shift2End = "21:00";

  const is24HourFormat = !new Date().toLocaleTimeString().match(/am|pm/i);

  let currentTime = new Date().toLocaleTimeString([], {
    hour12: is24HourFormat,
    hour: "2-digit",
    minute: "2-digit",
  });
  // console.log(!is24HourFormat);

  if (is24HourFormat) {
    const timeParts = currentTime.match(/(\d+):(\d+)(am|pm)/i);
    if (timeParts) {
      let [_, hour, minute, meridiem] = timeParts;
      hour = parseInt(hour, 10);
      if (meridiem.toLowerCase() === "pm" && hour < 12) {
        hour += 12;
      } else if (meridiem.toLowerCase() === "am" && hour === 12) {
        hour = 0;
      }
      currentTime = `${hour.toString().padStart(2, "0")}:${minute}`;
      console.log(currentTime);
    }
  } else {
    currentTime = currentTime.replace(/[^0-9:]/g, ""); // Remove AM/PM if present
  }

  if (currentTime >= shift1Start && currentTime <= shift1End) {
    shift.value = "S1";
  } else if (currentTime >= shift2Start && currentTime <= shift2End) {
    shift.value = "S2";
  } else {
    shift.value = "S3";
  }

  ls.set("shift", shift.value);
};

const onSubmit = async () => {
  const user = await transaksiStore.getUser(username.value, password.value);
  console.log(user);
  if (user) {
    if (props.type == "login") {
      determineShift();
      ls.set("pegawai", user);
      router.push(props.url);
    } else if (props.type === "check" && props.component === "SettingsDialog") {
      if (transaksiStore.isAdmin) {
        const SettingDialog = $q.dialog({
          component: SettingsDialog,
          persistent: true,
          noEscDismiss: true,
        });

        SettingDialog.update();
        dialogRef.value.hide();
      } else {
        $q.notify({
          type: "negative",
          message: "Anda Bukan Admin",
          position: "top",
          timeout: 1000,
        });
      }
    }
  } else {
    $q.notify({
      type: "negative",
      message: "Cek kembali username dan password anda",
      position: "top",
      timeout: 1000,
    });
  }
};

const handleKeyDownOnLoginDialog = async (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    dialogRef.value.hide();
  }
};
onMounted(() => {
  window.addEventListener("keydown", handleKeyDownOnLoginDialog);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDownOnLoginDialog);
});
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
