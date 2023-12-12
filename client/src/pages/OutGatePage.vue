<template>
  <div v-if="$q.screen.lt.md" class="text-h2">
    <q-card class="fixed-center">
      <img src="~assets/logo.png" />
      <q-card-section>
        <div class="text-h6">
          Silahkan buka halaman ini dengan resolusi di atas 1024px x 768px
        </div>
        <q-btn
          color="primary"
          icon="home"
          label="Home"
          @click="$router.push('/')"
        />
      </q-card-section>
    </q-card>
  </div>
  <div
    :key="componentStore.outGateKey"
    v-else
    class="relative fixed-top"
    :class="darkMode ? 'bg-primary' : 'bg-grey-4'"
  >
    <div
      v-show="!transaksiStore.isCheckedIn"
      class="flex row justify-between q-pl-lg no-wrap"
    >
      <q-img
        v-if="$q.screen.gt.sm"
        src="~assets/logo.png"
        spinner-color="primary"
        spinner-size="82px"
        width="250px"
        style="height: 15vh"
        class="q-ml-sm rounded-corner"
      />

      <div v-if="$q.screen.gt.md" class="q-mt-lg">
        <Quotes />
      </div>

      <div class="content-end q-pr-md">
        <!-- v-show="!transaksiStore.isCheckedIn" -->
        <div class="flex row justify-end q-mt-md">
          <!-- <ShinyCard class="q-mt-md" title="Total Kendaraan" /> -->
          <ShinyCard
            class="bg-indigo-10"
            title="Kendaraan Masuk"
            :jumlah="vehicleInToday"
          />
          <!-- shortkey="F3" -->
          <ShinyCard
            class="bg-teal-10 q-mx-md"
            title="Kendaraan Keluar"
            shortkey="F4"
            :jumlah="vehicleOutToday"
          />
          <ShinyCard
            class="bg-deep-orange-10"
            title="Kendaraan Parkir"
            :jumlah="vehicleInside"
          />
          <!-- shortkey="F5" -->
        </div>
      </div>
    </div>
    <div
      class="window-width flex row q-pr-lg q-col-gutter-sm"
      :class="
        transaksiStore.isCheckedIn
          ? 'justify-start q-mt-md q-ml-md'
          : 'justify-end'
      "
    >
      <!-- <div class="q-col-xs-6 q-col-sm-4 q-col-md-3"> -->
      <q-chip class="bg-transparent" icon="account_circle" :label="pegawai" />
      <!-- </div> -->
      <!-- <div class="q-col-xs-6 q-col-sm-4 q-col-md-3"> -->
      <q-chip
        class="bg-transparent"
        icon="work_history"
        :label="ls.get('shift')"
      />
      <!-- </div> -->
      <!-- <div class="q-col-xs-6 q-col-sm-4 q-col-md-3"> -->
      <q-chip
        class="bg-transparent"
        icon="place"
        :label="
          '(' +
          transaksiStore.lokasiPos.value +
          ') ' +
          transaksiStore.lokasiPos.label
        "
      />
      <Clock />
      <!-- </div> -->
      <!-- <div class="q-col-xs-6 q-col-sm-4 q-col-md-3">
          </div> -->
    </div>

    <div class="row justify-center items-center" style="height: 100vh">
      <div>
        <div
          v-show="!transaksiStore.isCheckedIn"
          ref="cardVideo"
          class="row justify-evenly items-center q-mt-lg q-py-sm fixed-center relative bg-transparent"
          style="width: 100vw; height: 100vh"
        >
          <div class="relative">
            <q-chip
              class="absolute bg-transparent"
              icon="camera"
              label="Kamera Pintu Masuk"
            />
            <q-skeleton
              v-if="cameraIn == null || cameraIn == '-'"
              height="62vh"
              width="49vw"
            />
            <CaemeraIn
              :key="componentStore.cameraInKey"
              v-else
              :style="{
                cursor: 'pointer',
                width: '46vw',
              }"
              class="rounded-corner"
            />
          </div>
          <div class="relative">
            <q-chip
              class="absolute bg-transparent"
              icon="camera"
              label="Kamera Pintu Keluar"
            />
            <q-skeleton
              v-if="cameraOut == null || cameraOut == '-'"
              height="62vh"
              width="49vw"
            />
            <CaemeraOut
              ref="cameraOutRef"
              :key="componentStore.cameraOutKey"
              v-else
              :style="{
                cursor: 'pointer',
                width: '46vw',
              }"
              class="rounded-corner"
            />
          </div>
        </div>
      </div>

      <!-- <q-space /> -->
      <div
        :class="!transaksiStore.isCheckedIn ? 'col-12' : ''"
        class="col-8 justify-center items-start"
      >
        <PaymentCard v-if="transaksiStore.isCheckedIn" />
      </div>
      <!-- <div
        v-show="transaksiStore.isCheckedIn"
        class="col-4 q-mt-lg fixed-top-right"
      >
        <div class="column q-mb-md q-mr-md">
          <FotoKendaraan title="Foto Masuk" />
          <FotoKendaraan title="Foto Keluar" />
        </div>
      </div> -->
    </div>

    <div
      class="flex row justify-center fixed full-width no-wrap"
      style="bottom: 20px"
    >
      <div class="col-8">
        <!-- style="width: 60vw; height: 10vh" -->
        <!-- input-class="input-box  text-white " -->
        <q-input
          v-show="
            !componentStore.hideInputPlatNomor && !transaksiStore.isCheckedIn
          "
          class="input-box rounded-corner relative z-top text-uppercase q-pa-md"
          :class="darkMode ? 'bg-grey-3 text-dark' : 'bg-secondary  text-white'"
          :input-class="
            darkMode
              ? 'input-box  text-dark text-weight-bolder'
              : 'input-box text-white text-weight-bolder'
          "
          input-style="height:10vh;border:0"
          :label-color="
            darkMode ? 'secondary text-h4 q-pb-xl' : 'yellow text-h4 q-pb-xl'
          "
          :color="darkMode ? 'bg-yellow' : 'bg-secondary '"
          item-aligned
          borderless
          v-model="transaksiStore.platNomor"
          label="Masukkan Plat Nomor"
          ref="inputPlatNomorRef"
          autofocus
          :rules="[
            (val) =>
              val
                ? transaksiStore.platNomor.length <= 9 ||
                  'Plat nomor terlalu banyak'
                : true,
          ]"
          @update:model-value="() => onInputPlatNomor()"
          @keydown.enter="onPressEnterPlatNomor()"
        >
          <template v-slot:prepend>
            <q-btn
              push
              label="F1"
              class="text-weight-bold q-mt-md"
              :class="darkMode ? 'bg-dark text-white' : 'bg-grey-3 text-dark'"
            />
          </template>

          <template v-slot:append>
            <q-btn
              push
              :size="'xl'"
              class="q-mt-md q-mr-md"
              :class="darkMode ? 'bg-dark text-white' : 'bg-grey-3 text-dark'"
              icon="keyboard_return"
              @click="onPressEnterPlatNomor()"
            />
          </template>
        </q-input>
      </div>
      <div v-if="componentStore.currentPage == 'outgate'">
        <q-btn
          flat
          class="fixed-bottom-right q-mb-xl"
          color="primary"
          icon="logout"
        >
          <q-badge
            color="primary"
            text-color="white"
            label="shift + L"
            class="q-ml-xs"
          />
        </q-btn>
        <!-- <q-btn
        flat
        class="absolute-bottom-right q-mb-lg"
        color="primary"
        size="sm"
        icon="summarize"
        @click="onClickKendaraanKeluar()"
      >
 <q-badge
          color="primary"
          text-color="white"
          label="shift + R"
          class="q-ml-xs"
        />
      </q-btn> -->
        <q-btn
          flat
          class="fixed-bottom-right q-mb-md"
          color="primary"
          size="sm"
          @click="onClickBukaManual()"
          label="Buka Manual"
        >
          <!-- icon="settings" -->
          <q-badge
            color="primary"
            text-color="white"
            label="F12"
            class="q-ml-xs"
          />
        </q-btn>

        <!-- <q-toggle
        v-model="darkMode"
        @update:model-value="darkModeToggle"
        color="green"
      /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useComponentStore } from "src/stores/component-store";
import { getTime, checkSubscriptionExpiration } from "src/utils/time-util";
import ls from "localstorage-slim";

//Components
import Clock from "../components/Clock.vue";
import PaymentCard from "src/components/PaymentCard.vue";
import Quotes from "src/components/Quotes.vue";
import ShinyCard from "src/components/ShinyCard.vue";
import CaemeraOut from "src/components/CameraOut.vue";
import CaemeraIn from "src/components/CameraIn.vue";

// dialogues
import TicketDialog from "src/components/TicketDialog.vue";
import KendaraanKeluarDialog from "src/components/KendaraanKeluarDialog.vue";
import JenisKendaraanDialog from "src/components/JenisKendaraanDialog.vue";

// import FotoKendaraan from "../components/FotoKendaraan.vue";
// import { useMorphStore } from "src/stores/morph-store";
// import JenisKendaraanCard from "../components/JenisKendaraanCard.vue";
// import NomorTiketCard from "src/components/CarMorph.vue";
// import InfoCard from "src/components/InfoCard.vue";
// import PetugasCard from "src/components/PetugasCard.vue";

const transaksiStore = useTransaksiStore();
const componentStore = useComponentStore();
const $q = useQuasar();

const darkMode = ref(ls.get("darkMode")) || ref(false);
const darkModeToggle = () => {
  ls.set("darkMode", darkMode.value);
};

const cardVideo = ref(null);
const pegawai = ls.get("pegawai") ? ls.get("pegawai").nama : null;

const cameraIn = ls.get("cameraIn") || null;
const cameraOut = ls.get("cameraOut") || null;
const cameraOutRef = ref(null);

const vehicleInToday = ref(0);
const vehicleOutToday = ref(0);
const vehicleInside = ref(0);

const router = useRouter();

const inputPlatNomorRef = ref(null);
const prefix = ref(ls.get("prefix"));
// defineExpose({
//   inputPlatNomorRef,
// });

// nopolInput.register(inputPlatNomorRef)

const onClickKendaraanKeluar = () => {
  const dialog = $q.dialog({
    component: KendaraanKeluarDialog,
  });
  // persistent: true,

  dialog.update();
};
const onInputPlatNomor = () => {
  if (transaksiStore.platNomor.length >= 3) {
    const firstCharacter = transaksiStore.platNomor?.charAt(0);

    if (!isNaN(firstCharacter)) {
      transaksiStore.platNomor =
        prefix.value + transaksiStore.platNomor?.toUpperCase();
    } else {
      transaksiStore.platNomor = transaksiStore.platNomor?.toUpperCase();
    }
  }
  // console.log(platNomorModel.value.toUpperCase());
};

const onClickBukaManual = async () => {
  const videoRef = cameraOutRef.value?.$refs.videoRef;
  // transaksiStore.waktuMasuk = waktuMasuk.value;

  if (videoRef !== undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL("image/png");

    transaksiStore.pic_body_keluar = imageBase64;
    // console.log(transaksiStore.pic_body_keluar);
  }
  await transaksiStore.setManualOpenGate();
  componentStore.openGate();
};

const onPressEnterPlatNomor = async () => {
  if (transaksiStore.platNomor.length < 4) {
    $q.notify({
      type: "negative",
      message: "Cek kembali plat nomor yang anda input",
      position: "bottom",
      timeout: 500,
    });
  } else {
    await transaksiStore.getCustomerByNopol();
    const dataCustomer = ref(transaksiStore.dataCustomer);

    // checkSubscriptionExpiration();
    if (dataCustomer.value == "") {
      const dialog = $q.dialog({
        component: JenisKendaraanDialog,
        noBackdropDismiss: true,
        persistent: true,
      });

      dialog.update();
    } else {
      const jenis_kendaraan = {
        id: dataCustomer.value?.id_jenis_kendaraan,
        label: dataCustomer.value?.jenis_kendaraan,
      };
      transaksiStore.selectedJenisKendaraan = jenis_kendaraan;
      console.log(jenis_kendaraan);
      const expiration = checkSubscriptionExpiration(dataCustomer.value?.akhir);
      console.log(transaksiStore.isMemberExpired);
      const dialog = $q.dialog({
        component: TicketDialog,
        // noBackdropDismiss: true,
        // persistent: true,
        componentProps: {
          title: jenis_kendaraan?.label,
          nama: dataCustomer.value?.nama,
          alamat: dataCustomer.value?.alamat,
          expiration: expiration,
        },
      });

      dialog.update();
      // componentStore.hideInputPlatNomor = true;
    }
  }
};

const handleKeyDown = (event) => {
  // console.log(event.key);
  if (componentStore.currentPage == "outgate") {
    if (event.key === "F1") {
      event.preventDefault();
      inputPlatNomorRef.value.focus();
    } else if (event.key === "F4") {
      event.preventDefault();
      onClickKendaraanKeluar();
    } else if (event.shiftKey === true && event.key === "R") {
      event.preventDefault();
      onClickKendaraanKeluar();
    } else if (event.shiftKey === true && event.key === "L") {
      event.preventDefault();
      // componentStore.stopCamera();
      ls.remove("pegawai");
      ls.remove("shift");
      // router.push("/");
      window.location.replace("/");
    } else if (event.shiftKey === true && event.key === "D") {
      event.preventDefault();
      darkMode.value = !darkMode.value;
      darkModeToggle();
    } else if (event.key === "F12") {
      event.preventDefault();
      onClickBukaManual();
    }
  }
};

onMounted(async () => {
  componentStore.currentPage = "outgate";
  vehicleInToday.value = await transaksiStore.getCountVehicleInToday();
  const vehicleOut = await transaksiStore.getCountVehicleOutToday();
  const totalVehicleOut = vehicleOut.reduce(
    (total, count) => Number(total) + Number(count.count),
    0
  );
  console.log(totalVehicleOut);
  vehicleOutToday.value = totalVehicleOut;
  // // console.log(vehicleOutToday.value);
  // vehicleInside.value = await transaksiStore.getCountVehicleInside();

  // if (transaksiStore.lokasiPos === "-") {
  //   onClickSettings();
  //   // $q.notify({
  //   //   type: "negative",
  //   //   message: "Silahkan pilih lokasi terlebih dahulu",
  //   //   position: "center",
  //   // });
  // } else
  if (
    transaksiStore.API_URL === "-" ||
    !pegawai ||
    !ls.get("shift") ||
    transaksiStore.lokasiPos === "-"
  ) {
    router.push("/");
  }
  // inputPlatNomorRef ? inputPlatNomorRef.value.focus() : "";

  window.addEventListener("keydown", handleKeyDown);

  // if ($q.platform.is.mobile) {
  //   router.push("/");
  // }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  // console.log("unMounted");
});

onUpdated(() => {
  console.log("updated");
});
// const inputRef = ref(null);
// const isTransaksi = ref(true);
// const isHover = ref({
//   car: false,
//   bike: false,
//   bus: false,
// });
// const onClickTicket = (type) => {
</script>

<style>
:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.rounded-corner {
  border-radius: 10px;
}

/* } */
</style>

<style scoped>
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__append .q-field__marginal) {
  height: 10vh;
  width: 70vw;
  padding-top: 10px;
  font-size: 80px;
  font-family: "Courier New", Courier, monospace;
}
</style>
