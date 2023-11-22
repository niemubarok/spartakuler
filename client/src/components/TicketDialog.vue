<template>
  <!-- :maximized="true" -->
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
    no-route-dismiss
    @hide="onDialogHide"
    class="q-pa-xl"
    content-class="dialog__backdrop"
  >
    <!-- :content-css="{ 'background-color': 'rgba(0, 0, 0, 0.9)' }" -->
    <q-card
      style="width: 50vw; height: fit-content"
      class="q-px-md q-pt-xl q-pb-md glass rounded-corner relative"
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
      <!-- <q-item>
        <q-item-section avatar>
          <q-icon :name="props.icon" size="xl" />
        </q-item-section>
        <q-item-section>
          <q-item-label
            style="margin-left: -15px"
            class="q-mt-xs text-weight-bolder text-h5"
            >{{ props.title }}</q-item-label
          >
        </q-item-section>
      </q-item> -->
      <div>
        <q-chip
          class="bg-yellow-7 text-h6 text-weight-bolder absolute-top-left"
          :label="props.title"
        />
      </div>
      <div class="flex justify-center">
        <member-card
          v-if="transaksiStore.isMember"
          :nama="props.nama"
          :expiration="props.expiration"
          :ribbonText="props.ribbonText"
        />
        <plat-nomor v-else class="q-ma-md" />
      </div>
      <!-- <q-separator class="border-1"></q-separator> -->
      <!-- input-class="text-white" -->

      <!-- style="height: 10vh"
      input-class="text-h4 text-white font-bold autofocus"
      input-style="height:10vh" -->
      <!-- outlined="bg-primary text-white font-bold" -->
      <!-- <q-select
        outlined
        ref="jenisKendaraanRef"
        v-model="jenisKendaraanModel"
        label="Pilih Jenis Kendaraan"
        :options="jenisKendaraanOptions"
        style="width: 250px"
        autofocus
        behavior="dialog"
        @keydown="handleKeydownOnJenisKendaraan($event)"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-chip
                square
                class="bg-dark text-white"
                :label="scope.opt.value"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->

      <!-- <div>

      </div> -->

      <q-input
        borderless
        class="input-box bg-primary rounded-corner relative q-pa-sm"
        input-class="input-box text-white"
        label-color="yellow text-h6"
        color="teal"
        v-model="transaksiStore.nomorTiket"
        label="Scan Nomor Struk"
        mask="XXXXXXXXXXXXXXXXXXXXX"
        ref="strukRef"
        :rules="[
          (val) => (val ? val.length >= 4 || 'Nomor ticket kurang' : true),
        ]"
        @keydown.enter="onSaveSettings(props.type)"
        autofocus
      >
        <template v-slot:append>
          <q-btn
            push
            :size="'xl'"
            class="q-mt-xl q-mr-lg bg-white text-dark"
            icon="keyboard_return"
          />
          <!-- @click="onSaveSettings(props.type)" -->
          <!-- @click="
              [morphStore.nextCarMorph(), transaksiStore.setCheckIn(true)]
            " -->
        </template>
      </q-input>

      <!-- <q-card-actions align="right"> -->
      <!-- <q-btn flat label="Action 1" /> -->
      <!-- <q-btn flat label="Simpan" @click="onSaveSettings" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { onMounted, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import MemberCard from "./MemberCard.vue";
import PlatNomor from "./PlatNomor.vue";
import { useComponentStore } from "src/stores/component-store";

import { calculateParkingDuration } from "src/utils/time-util";
// import ls from "localstorage-slim";

// ls.config.encrypt = false;
const $q = useQuasar();
const transaksiStore = useTransaksiStore();
const componentStore = useComponentStore();

const props = defineProps({
  title: String,
  nama: String,
  expiration: String,
  ribbonText: String,
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();
// const jenisKendaraanModel = ref(null);
// const jenisKendaraanRef = ref(null);

// const handleKeydownOnJenisKendaraan = (event) => {
//   console.log(event.key);
//   const key = event.key;
//   const matchingOption = jenisKendaraanOptions.value.find(
//     (option) => option.value === key.toUpperCase()
//   );
//   // (option) => console.log(option.value === key.toUpperCase())
//   if (matchingOption) {
//     jenisKendaraanModel.value = matchingOption.value;
//     jenisKendaraanRef.value.hidePopup();
//   }
// };

// onMounted(() => {
//   jenisKendaraanOptions.value = transaksiStore.jenisKendaraan.map((item) => {
//     return {
//       label: item.nama,
//       value: item.id,
//     };
//   });
//   // jenisKendaraanOptions.value = transaksiStore.jenisKendaraan;
// });

const onSaveSettings = async () => {
  if (transaksiStore.nomorTiket.length < 4) {
    $q.notify({
      type: "negative",
      message: "Nomor tiket tidak valid",
      position: "top",
      timeout: 1000,
    });
    return;
  }

  try {
    const transaksi = await transaksiStore.getTransaksiByNopol(
      transaksiStore.nomorTiket
    );

    console.log(transaksi);

    if (transaksi.length) {
      const waktuMasuk = new Date(transaksi[0].waktu_masuk);
      const waktuKeluar = new Date();
      const lamaParkir = calculateParkingDuration(waktuMasuk);
      transaksiStore.durasi = `${lamaParkir.hours} Jam ${lamaParkir.minutes} Menit`;
      await transaksiStore.calculateParkingFee(waktuMasuk, waktuKeluar);

      // // const biayaParkir = calculateParkingFee(waktuMasuk, waktuKeluar);

      // console.log(lamaParkir);
      transaksiStore.waktuMasuk = transaksi[0].waktu_masuk;
      // console.log(transaksi[0].waktu_masuk);
      // console.log(waktuKeluar);
      // console.log(biayaParkir);
      // console.log(transaksiStore.transaksi.value);

      transaksiStore.setCheckIn(true);

      dialogRef.value.hide();
    } else {
      $q.notify({
        type: "negative",
        message: "Nomor Struk Sudah digunakan",
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error,
    });
  }

  // if (type == "car") {
  //   transaksiStore.jenisKendaraan = "Mobil";
  // } else if (type == "bus") {
  //   transaksiStore.jenisKendaraan = "Bus";
  // } else if (type == "bike") {
  //   transaksiStore.jenisKendaraan = "Motor";
  // }
  // window.location.reload();
};
const onDialogHide = () => {
  // console.log("at hide");

  componentStore.hideInputPlatNomor = false;
  transaksiStore.dataCustomer = "";
};

const onInputTicket = () => {
  if (transaksiStore.platNomor.length >= 3) {
    const firstCharacter = transaksiStore.platNomor?.charAt(0);

    if (!isNaN(firstCharacter)) {
      transaksiStore.platNomor = "B" + transaksiStore.platNomor?.toUpperCase();
    } else {
      transaksiStore.platNomor = transaksiStore.platNomor?.toUpperCase();
    }
  }
  // console.log(platNomorModel.value.toUpperCase());
};

onMounted(() => {
  // transaksiStore.nomorTiket = "";
});

// const jenisKendaraanValue = computed(()=>;

// const filterJenisKendaraan = (val, update) => {
//   if (val === '') {
//     update(() => {
//       jenisKendaraanOptions.value =  jenisKendaraanValue
//     })
//     return
//   }
//   update(() => {
//           const needle = val.toLowerCase()
//           jenisKendaraanOptions.value = jenisKendaraanValue.filter(v => v.toLowerCase().indexOf(needle) > -1)
//         })
//       }
</script>

<style scoped>
:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.432);
  backdrop-filter: blur(30px);
}
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.301);
  border-radius: 20px;
  border: 1px solid rgba(14, 13, 13, 0.125);
}

/* :deep(.input-box .q-field__append), */
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__append .q-field__marginal) {
  height: 10vh;
  width: 80vw;
  font-size: 2rem;
  font-family: "Courier New", Courier, monospace;
}
</style>
