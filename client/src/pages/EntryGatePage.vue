<template>
  <q-page class="row items-center justify-evenly">
    <!-- Show manless or manual interface based on settings -->
    <template v-if="isManlessMode">
      <ManlessEntryGate class="full-width q-pa-md" />
    </template>
    <template v-else>
        <OutGatePage/>
      <!-- <div class="column items-center q-gutter-y-md full-width">
        <Clock />
        <Camera 
          :cameraUrl="cameraUrl"
          :fileName="'entry'"
          :isInterval="true"
        />
      </div> -->
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ManlessEntryGate from 'src/components/ManlessEntryGate.vue'
import Camera from 'components/Camera.vue'
import Clock from 'components/Clock.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import OutGatePage from 'src/pages/OutGatePage.vue'

const settingsStore = useSettingsStore()
const isManlessMode = ref(localStorage.getItem('manlessMode') === 'true')
const cameraUrl = ref('')

onMounted(() => {
  cameraUrl.value = settingsStore.cameraInUrl
})

// Watch for settings changes
window.addEventListener('storage', (e) => {
  if (e.key === 'manlessMode') {
    isManlessMode.value = e.newValue === 'true'
  }
})
</script>