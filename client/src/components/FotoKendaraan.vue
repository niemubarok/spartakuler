<template>
  <q-card flat class="bg-transparent col relative">
    <div class="absolute z-top">
      <q-chip dense square icon="image" :label="title" class="glass" />
    </div>
    <div v-if="props.type == 'image'">
      <img
        class="rounded-corner glass"
        style="height: 40vh; width: 30vw"
        :src="props.url"
      />
    </div>
    <div v-else-if="props.type == 'video'">
      <slot name="video"> </slot>
    </div>
    <div v-else>
      <q-skeleton height="40vh" width="30vw">Tidak ada Kamera </q-skeleton>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: String,
  type: String,
  url: String,
});
</script>

<style scoped>
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.63);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.125);
}
</style>
