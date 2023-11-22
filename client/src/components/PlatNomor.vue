<template>
  <q-card class="items-center" style="width: fit-content">
    <q-chip
      style="width: fit-content; min-width: 200px"
      class="rounded-corner q-px-md bg-grey-10 text-h4 text-white justify-center relative"
    >
      <q-badge
        style="top: -10px; left: 7px"
        class="bg-yellow-7 text-dark absolute-top-left"
        label="Plat Nomor"
      />
      <span class="full-width text-center text-weight-bolder">
        {{
          transaksiStore.platNomor
            ? transaksiStore.platNomor.replace(/(\D)(\d+)(\D)/, "$1 $2 $3")
            : ""
        }}
      </span>
    </q-chip>
  </q-card>
</template>

<script setup>
import { useTransaksiStore } from "src/stores/transaksi-store";

const transaksiStore = useTransaksiStore();
</script>
