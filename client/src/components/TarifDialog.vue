<template>
  <q-dialog ref="dialogRef" >
    <q-card
      class="q-px-md q-pt-sm glass relative"
      style="width: 500px; height: fit-content"
    >
      <q-card-section>
        <q-input
          v-model="tarif"
          label="Tarif"
          dense
          outlined
          autofocus
          autocomplete="off"
          @keydown.enter="onSubmit"
          ></q-input>
          <q-card-actions align="right">
            <q-btn
            push
            icon="keyboard_return"
            type="submit"
            color="primary"
            class="q-pa-xl"
            />
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

const { dialogRef } = useDialogPluginComponent();
const componentStore = useComponentStore();
const transaksiStore = useTransaksiStore();

const $q = useQuasar();
const props = defineProps({
  type: String,
  url: String,
  component: String,
});

const tarif = ref("");

defineEmits([...useDialogPluginComponent.emits]);

const onSubmit = async () => {
  
  if (tarif.value !== undefined) {
    transaksiStore.biayaParkir = tarif.value;
    transaksiStore.setCheckIn(true);
    dialogRef.value.hide();
    componentStore.currentPage = "payment";
  
  } else {
    $q.notify({
      type: "negative",
      message: "Tarif Harus Diisi",
      position: "top",
      timeout: 1000,
    });
  }
}

const handleKeyDownOnTarifDialog = async (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    dialogRef.value.hide();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDownOnTarifDialog);
  console.log(componentStore.currentPage);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDownOnTarifDialog);
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
