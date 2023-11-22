<template>
  <!-- :maximized="true" -->
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
    no-route-dismiss
    @hide="onDialogHide"
    :maximized="true"
    content-class="dialog__backdrop relative"
  >
    <!-- class="q-pa-sm" -->
    <div>
      <q-card
        style="width: 50vw; height: fit-content"
        class="q-pa-sm dark-glass fixed-center relative"
      >
        <div>
          <q-avatar
            size="30px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-7"
            color="grey-5"
            icon="close"
            @click="dialogRef.hide()"
          />
        </div>
        <!-- <div class="flex row justify-start">
          <div class="col-2 q-mr-xl"> -->
        <!-- </div> -->

        <div
          class="text-center text-weight-bolder text-grey-2 text-h5 q-ml-md q-mb-md"
        >
          <!-- <q-icon name="patient_list" size="md" style="" /> -->
          <!-- class="absolute-top-left" -->
          .:: Data Kendaraan Keluar ::.
        </div>
        <!-- </div> -->
        <div class="flex justify-center">
          <q-table
            :rows="tableData"
            :columns="tableColumns"
            row-key="id"
            dense
            virtual-scroll
            class="sticky-header-table rounded-borders q-pa-md glass full-width"
            style="height: 40vh"
            no-data-label="No data available"
          >
            <!-- <template #header-cell(no)> No </template>
            <template #header-cell(namaPetugas)> Nama Petugas </template>
            <template #header-cell(shift)> Shift </template>
            <template #header-cell(uangMasuk)> Uang Masuk </template>
            <template #header-cell(jumlahMotor)> Jumlah Motor </template>
            <template #header-cell(mobil)> Mobil </template>
            <template #header-cell(truck)> Truck </template> -->

            <template #body-cell(no)="props">
              {{ props.index + 1 }}
            </template>
            <template #body-cell(namaPetugas)="props">
              {{ props.value }}
            </template>
            <template #body-cell(shift)="props">
              {{ props.value }}
            </template>
            <template #body-cell(uangMasuk)="props">
              {{ props.value }}
            </template>
            <template #body-cell(jumlahMotor)="props">
              {{ props.value }}
            </template>
            <template #body-cell(mobil)="props">
              {{ props.value }}
            </template>
            <template #body-cell(truck)="props">
              {{ props.value }}
            </template>
          </q-table>
        </div>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import MemberCard from "./MemberCard.vue";
import PlatNomor from "./PlatNomor.vue";
import { useComponentStore } from "src/stores/component-store";
// import ls from "localstorage-slim";
// import { useClassesStore } from "src/stores/classes-store";

// ls.config.encrypt = false;
const transaksiStore = useTransaksiStore();
const componentStore = useComponentStore();

const props = defineProps({
  title: String,
  icon: String,
  type: String,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef } = useDialogPluginComponent();

onMounted(async () => {});

const onSaveSettings = (type) => {
  transaksiStore.setCheckIn(true);
  dialogRef.value.hide();

  if (type == "car") {
    transaksiStore.jenisKendaraan = "Mobil";
  } else if (type == "bus") {
    transaksiStore.jenisKendaraan = "Bus";
  } else if (type == "bike") {
    transaksiStore.jenisKendaraan = "Motor";
  }
  // window.location.reload();
};
const onDialogHide = () => {
  // console.log("at hide");
  componentStore.hideInputPlatNomor = false;
};

const tableColumns = [
  {
    name: "No.",
    required: true,
    align: "left",
    field: "no",
    label: "No.",
    sortable: true,
  },
  {
    name: "Nama Petugas",
    required: true,
    align: "left",
    field: "namaPetugas",
    label: "Nama Petugas",
    sortable: true,
  },
  {
    name: "Shift",
    required: true,
    align: "left",
    field: "shift",
    label: "Shift",
    sortable: true,
  },
  {
    name: "Uang Masuk",
    required: true,
    align: "left",
    field: "uangMasuk",
    label: "Uang Masuk",
    sortable: true,
  },
  {
    name: "Motor",
    required: true,
    align: "center",
    field: "motor",
    label: "Motor",
    sortable: true,
  },
  {
    name: "Mobil",
    required: true,
    align: "center",
    field: "mobil",
    label: "Mobil",
    sortable: true,
  },
  {
    name: "Truck",
    required: true,
    align: "center",
    field: "truck",
    label: "Truck",
    sortable: true,
  },
];

const tableData = [
  {
    id: 1,
    no: 1,
    namaPetugas: "John Doe",
    shift: "Pagi",
    uangMasuk: "Rp. 200.000",
    motor: 10,
    mobil: 5,
    truck: 2,
  },
  {
    id: 2,
    no: 2,
    namaPetugas: "Jane Smith",
    shift: "Siang",
    uangMasuk: "Rp. 100.000",
    motor: 15,
    mobil: 8,
    truck: 3,
  },
  {
    id: 3,
    no: 3,
    namaPetugas: "Alice Johnson",
    shift: "Siang",
    uangMasuk: "Rp. 100.000",
    motor: 15,
    mobil: 8,
    truck: 3,
  },
  {
    id: 4,
    no: 4,
    namaPetugas: "Bob Williams",
    shift: "Siang",
    uangMasuk: "Rp. 100.000",
    motor: 15,
    mobil: 8,
    truck: 3,
  },
  {
    id: 5,
    no: 5,
    namaPetugas: "Eve Davis",
    shift: "Siang",
    uangMasuk: "Rp. 100.000",
    motor: 15,
    mobil: 8,
    truck: 3,
  },
  {
    id: 6,
    no: 6,
    namaPetugas: "Frank Wilson",
    shift: "Siang",
    uangMasuk: "Rp. 100.000",
    motor: 15,
    mobil: 8,
    truck: 3,
  },
  {
    id: 7,
    no: 7,
    namaPetugas: "Anita Sari",
    shift: "Malam",
    uangMasuk: "Rp. 150.000",
    motor: 12,
    mobil: 6,
    truck: 1,
  },
  {
    id: 8,
    no: 8,
    namaPetugas: "Budi Santoso",
    shift: "Malam",
    uangMasuk: "Rp. 150.000",
    motor: 12,
    mobil: 6,
    truck: 1,
  },
  {
    id: 9,
    no: 9,
    namaPetugas: "Citra Permatasari",
    shift: "Malam",
    uangMasuk: "Rp. 150.000",
    motor: 12,
    mobil: 6,
    truck: 1,
  },
  {
    id: 10,
    no: 10,
    namaPetugas: "Dian Purnomo",
    shift: "Malam",
    uangMasuk: "Rp. 150.000",
    motor: 12,
    mobil: 6,
    truck: 1,
  },
  {
    id: 11,
    no: 11,
    namaPetugas: "Eko Prasetio",
    shift: "Malam",
    uangMasuk: "Rp. 150.000",
    motor: 12,
    mobil: 6,
    truck: 1,
  },
];
</script>

<style scoped>
:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.863);
  border: 1px solid rgba(14, 13, 13, 0.125);
  border-radius: 10px;
}

.dark-glass {
  border-radius: 10px;

  background-color: #083517;
  background: linear-gradient(
    0deg,
    rgba(40, 44, 52, 1) 0%,
    rgba(17, 0, 32, 0.5) 100%
  );
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}
</style>

<style lang="sass">
.sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #E2DFE4

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
/* :deep(.input-box .q-field__append), */
/* :deep(.input-box .q-field__control),
// :deep(.input-box .q-field__append .q-field__marginal) {
//   height: 10vh;
//   width: 80vw;
//   font-size: 2rem;
//   font-family: "Courier New", Courier, monospace;
// } */
</style>
