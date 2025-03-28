<template>
  <div 
    class="connection-indicator" 
    :class="[
      isConnected ? 'connected' : 'disconnected',
      isDark ? 'dark' : 'light'
    ]"
  >
    <q-icon :name="icon || (isConnected ? 'cloud_done' : 'cloud_off')" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  isConnected: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})

const isDark = inject('isDark', false)
</script>

<style scoped>
.connection-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.connection-indicator.light {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
}

.connection-indicator.dark {
  background-color: rgba(30, 30, 30, 0.9);
  color: #fff;
}

.connection-indicator.connected.light {
  background-color: rgba(0, 200, 0, 0.2);
  color: #f3f8f3;
}

.connection-indicator.connected.dark {
  background-color: rgba(0, 200, 0, 0.2);
  color: #00ff00;
}

.connection-indicator.disconnected.light {
  background-color: rgba(255, 0, 0, 0.2);
  color: #8b0000;
}

.connection-indicator.disconnected.dark {
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
}
</style>