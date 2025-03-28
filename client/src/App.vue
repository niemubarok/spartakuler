<template>
  <router-view />
</template>

<script setup>
import { onMounted, provide } from 'vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

// Provide dark mode state globally
provide('isDark', themeStore.isDark)

onMounted(() => {
  themeStore.initDarkMode()
})
</script>

<style>
/* Global dark mode styles */
body.body--dark {
  background-color: #121212;
  color: #fff;
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
