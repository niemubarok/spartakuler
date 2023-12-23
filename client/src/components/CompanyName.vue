<template>
  <div>
    <!-- v-if="$q.screen.gt.sm" -->
    <q-chip
      flat
      class="text-h4 text-weight-bolder"
      :label="ls.get('companyName')?.toUpperCase()"
    />
  </div>
</template>

<script setup>
import { useSettingsStore } from "src/stores/settings-store";
import { onMounted } from "vue";
import ls from "localstorage-slim";

const settingsStore = useSettingsStore();

onMounted(async () => {});
</script>
