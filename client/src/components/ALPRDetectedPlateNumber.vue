<template>
    <q-card
      class="items-center bg-dark q-pa-xs"
      style="max-width: 20dvw; height: 60px"
    >
      <!-- style="min-width: 200px" -->
      <q-chip
        class="rounded-corner q-px-lg bg-white text-h4 text-dark justify-center relative full-width"
        style="height:50px; width: 100%;"
        >
        <!-- style="box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.2)" -->
        <q-badge
          style="top: -10px; left: 7px"
          class="bg-dark text-white absolute-top-left inset-shadow"
          :color="badge > 0.85 ? 'positive' : 'warning'"
          :label="`C: ${badge} %`"
        />
        <span
          style="width: 100%; text-align: center; font-weight: bolder; 
          font-size: clamp(0.2rem, 1.5vw, 1.5rem);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);"
        >
          {{
            plate_number?.replace(/(\D)(\d+)(\D)/, "$1 $2 $3")
              
          }}
        </span>
      </q-chip>
    </q-card>
  </template>
  
  <script setup>
// import { useThemeStore } from '../stores/theme'
// const themeStore = useThemeStore()
// const isDark = computed(() => themeStore.isDark)

const props = defineProps({
    plate_number: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: "ALPR",
    },
    });
  </script>
  