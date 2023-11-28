<template>
  <div :ref="paymentCardKey" class="relative">
    <Clock class="absolute-top-left q-ma-md" />
    <!-- card untuk transaksi pembayaran -->
    <q-card
      flat
      rounded
      class="gradient-primary q-ma-md fixed-top relative"
      style="top: 5vh; width: 95vw; height: 85vh; border-radius: 10px"
    >
      <!-- <div>
        <q-avatar
          size="40px"
          class="cursor-pointer z-top absolute-top-left q-ma-sm"
          text-color="grey-7"
          color="grey-2"
          icon="close"
        >
        </q-avatar>
      </div> -->
      <q-card-section>
        <q-card
          flat
          bordered
          class="glass q-mt-xl"
          style="width: 60vw; height: fit-content"
        >
          <MemberRibbon v-if="transaksiStore.isMember" />
          <div>
            <q-chip square class="glass text-primary text-h6"
              >Detail Parkir</q-chip
            >
          </div>

          <q-card-section>
            <div class="flex row">
              <div class="col-5">
                <q-timeline color="secondary" class="q-ma-xl">
                  <q-timeline-entry
                    :title="tanggalMasuk"
                    subtitle="Tanggal Masuk"
                    icon="today"
                  />
                  <q-timeline-entry
                    :title="waktuMasuk"
                    subtitle="Waktu Masuk"
                    icon="schedule"
                  />

                  <q-timeline-entry
                    :title="transaksiStore.durasi"
                    subtitle="Lama Parkir"
                    icon="timer"
                  />
                </q-timeline>
              </div>
              <div class="col-6">
                <div class="column">
                  <div class="col q-mb-md">
                    <!-- NOMOR TIKET -->
                    <q-chip
                      square
                      outline
                      class="bg-transparent q-py-lg text-h6 text-dark q-mb-md relative full-width"
                      :label="transaksiStore.nomorTiket"
                    >
                      <!-- style="border-color: ;" -->
                      <q-badge
                        color="primary"
                        text-color="white"
                        label="No. Tiket "
                        class="q-mb-md absolute-top-left"
                        style="top: -8px; left: 5px"
                      />
                    </q-chip>
                    <!-- JENIS KENDARAAN  -->
                    <q-chip
                      square
                      outline
                      class="bg-transparent q-py-lg text-h6 text-dark q-mb-md relative full-width"
                      :label="transaksiStore.selectedJenisKendaraan?.label"
                    >
                      <!-- style="border-color: ;" -->
                      <!-- floating -->
                      <q-badge
                        color="primary"
                        text-color="white"
                        label="Jenis Kendaraan"
                        class="q-mb-md absolute-top-left"
                        style="top: -8px; left: 5px"
                      />
                    </q-chip>
                  </div>

                  <div class="flex justify-end q-mr-xl q-mt-md">
                    <!-- PLAT NOMOR  -->

                    <PlatNomor style="transform: scale(1.5)" />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section>
        <div class="flex row justify-start">
          <!-- <q-btn
            outline
            class="rounded-corner q-mt-xl text-right text-grey-5 text-h4 bg-transparent"
            label="BUKA MANUAL"
            size="sm"
            style="width: 10vw; height: 5vh"
          /> -->
          <!-- TOTAL BAYAR  -->
          <q-card
            flat
            bordered
            class="glass text-dark q-pr-md q-mr-xl relative"
            style="width: 40vw"
          >
            <q-card-section>
              <div class="text-h6 text-right">Biaya Parkir</div>
              <div
                class="text-right text-weight-bold"
                style="
                  font-size: clamp(3rem, 5vw, 5rem);
                  font-family: 'Courier Prime', monospace;
                "
              >
                {{
                  transaksiStore.biayaParkir
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                    .split(",")[0]
                }}
              </div>
            </q-card-section>
          </q-card>

          <q-btn
            push
            class="text-right text-dark text-weight-bolder text-h4 bg-yellow"
            label="BAYAR"
            style="width: 15vw; font-size: clamp(2rem, 1vw, 1rem)"
          >
            <q-btn
              push
              color="grey-9"
              text-color="white"
              icon="keyboard_return"
              class="q-pa-md text-weight-bolder text-body q-ml-sm"
            />
          </q-btn>
        </div>
      </q-card-section>
      <div class="col-4">
        <div class="column q-mt-lg q-mb-md q-mr-md fixed-top-right">
          <FotoKendaraan title="Foto Masuk" type="image" :url="picBodyMasuk" />

          <FotoKendaraan
            v-if="!transaksiStore.pic_body_keluar"
            title="Kamera Keluar"
            type="video"
          >
            <template v-slot:video>
              <q-skeleton
                v-if="cameraOut == null || cameraOut === '-'"
                height="40vh"
                width="30vw"
                class="relative"
              >
                <h4 class="absolute-center text-center text-grey-5">
                  <q-icon name="videocam_off" size="lg" />
                  Tidak ada Kamera
                </h4>
              </q-skeleton>
              <!-- @capture="captureCameraOut()" -->
              <CameraOut
                ref="cameraOutRef"
                v-else
                :style="{ width: '30vw' }"
                class="q-mt-sm glass"
              />
            </template>
            <!-- width: '42vw', -->
          </FotoKendaraan>
          <FotoKendaraan
            v-else
            title="Foto Masuk"
            type="image"
            :url="transaksiStore.pic_body_keluar"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTransaksiStore } from "src/stores/transaksi-store";
import { useComponentStore } from "src/stores/component-store";
import FotoKendaraan from "src/components/FotoKendaraan.vue";
import { format, useQuasar } from "quasar";
import CameraOut from "./CameraOut.vue";
import Clock from "./Clock.vue";
import PaymentDialogComponent from "./PaymentDialog.vue";
import OpenGateDialogComponent from "./OpenGateDialog.vue";
import ls from "localstorage-slim";
import PlatNomor from "./PlatNomor.vue";
import MemberRibbon from "./MemberRibbon.vue";

import axios from "axios";

const $q = useQuasar();
const transaksiStore = useTransaksiStore();
const componentStore = useComponentStore();
// const buttonBatal = ref(false);
const cameraOut = ls.get("cameraOut") || null;
const cameraOutRef = ref(null);
// const bayarParkir = () => {
//   // logika bayar parkir
// };

const waktuMasuk = ref(
  new Date(transaksiStore.waktuMasuk)
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\./g, ":")
);

const tanggalMasuk = ref(
  new Date(transaksiStore.waktuMasuk).toLocaleString("id-ID", {
    // weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);
// const lokasiPos = ref(ls.get("lokasiPos")?.label);
const isPaymentDialogMounted = ref(false);

const onClickBayar = async () => {
  // const video = videoRef.value;
  const videoRef = cameraOutRef.value?.$refs.videoRef;

  if (videoRef !== undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL("image/png");

    transaksiStore.pic_body_keluar = imageBase64;
  }

  console.log("isPaymentDialogMounted.value:", !isPaymentDialogMounted.value);
  console.log("transaksiStore.isMember:", !transaksiStore.isMember);
  console.log(
    "transaksiStore.isMemberExpired:",
    transaksiStore.isMemberExpired
  );
  console.log(
    "componentStore.currentPage === 'payment':",
    componentStore.currentPage === "payment"
  );

  if (
    !isPaymentDialogMounted.value &&
    !transaksiStore.isMember &&
    transaksiStore.isMemberExpired &&
    componentStore.currentPage === "payment"
  ) {
    const paymentDialog = $q.dialog({
      component: PaymentDialogComponent,
      noBackdropDismiss: true,
      // noEscDismiss: true,
      // persistent: true,
    });

    paymentDialog.update();
    isPaymentDialogMounted.value = true;
  } else {
    if (componentStore.currentPage === "payment") {
      const updateTransaksi = await transaksiStore.updateTableTransaksi();
      if (updateTransaksi == 200) {
        const openGateDialog = $q.dialog({
          component: OpenGateDialogComponent,
          noBackdropDismiss: true,
        });

        openGateDialog.update();
      }
      // isPaymentDialogMounted.value = true;
    }
  }
};

let pressedKeys = "";
const targetKeys = "BUKA MANUAL";
const picBodyMasuk = ref();

const handleKeyDown = (event) => {
  // console.log(event.key);

  if (componentStore.currentPage === "payment") {
    if (event.key === "Enter") {
      event.preventDefault();
      onClickBayar();
      pressedKeys = "";
    }
    if (event.shiftKey === true && event.key === "Escape") {
      event.preventDefault();
      onClosePaymentCard();
      pressedKeys = "";
    } else {
      // Add the pressed key to the string of pressed keys
      pressedKeys += event ?? event.key.toUpperCase();

      // Check if the pressed keys match the target keys
      if (pressedKeys === targetKeys) {
        // Call the function to execute
        console.log("Buka Manual");
      }

      // Reset the pressed keys string if it doesn't match the target keys
      if (!targetKeys.startsWith(pressedKeys)) {
        pressedKeys = "";
      }
    }
  }
};

window.addEventListener("keydown", handleKeyDown);

const onClosePaymentCard = () => {
  componentStore.currentPage = "outgate";
  componentStore.setOutGateKey();
  transaksiStore.setCheckIn(false);
  transaksiStore.$reset();
};
onMounted(async () => {
  // console.log(transaksiStore.waktuMasuk);
  componentStore.currentPage = "payment";
  console.log(componentStore.currentPage);
  try {
    const getPicBodyMasuk = await axios.post(
      transaksiStore.API_URL + "/transactions/pic",
      {
        no_pol: transaksiStore.nomorTiket,
      }
    );
    picBodyMasuk.value = getPicBodyMasuk.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.76);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.gradient-primary {
  background-color: hsla(239, 100%, 80%, 1);
  background-image: radial-gradient(
      at 24% 1%,
      hsla(275, 100%, 28%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 19% 98%, hsla(258, 96%, 28%, 1) 0px, transparent 50%),
    radial-gradient(at 24% 48%, hsla(292, 56%, 54%, 1) 0px, transparent 50%),
    radial-gradient(at 9% 13%, hsla(225, 86%, 64%, 1) 0px, transparent 50%),
    radial-gradient(at 64% 45%, hsla(275, 80%, 37%, 1) 0px, transparent 50%),
    radial-gradient(at 49% 37%, hsla(225, 42%, 48%, 1) 0px, transparent 50%),
    radial-gradient(at 76% 5%, hsla(14, 74%, 66%, 1) 0px, transparent 50%);
}
</style>
