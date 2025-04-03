import { boot } from 'quasar/wrappers'
import axios from 'axios'
import ls from 'localstorage-slim'
import { ref } from 'vue'
import { Notify } from 'quasar'

// Create global connection status for both servers
export const isBackendConnected = ref(true)
export const isAlprConnected = ref(true)

// Default config
const defaultConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

// Create axios instances with default config
const api = axios.create({ 
  ...defaultConfig,
  baseURL: ls.get("API_URL") 
})

const alpr = axios.create({ 
  ...defaultConfig,
  baseURL: ls.get("ALPR_URL") || process.env.ALPR_SERVICE_URL 
})

// Add response interceptors for backend server
api.interceptors.response.use(
  (response) => {
    isBackendConnected.value = true
    return response
  },
  (error) => {
    if (!error.response || error.code === 'ERR_NETWORK') {
      isBackendConnected.value = false
      // Notify.create({
      //   type: 'negative',
      //   message: 'Backend server connection error. Please check your connection.',
      //   position: 'top',
      //   timeout: 3000
      // })
    }
    return Promise.reject(error)
  }
)

// Add response interceptors for ALPR server
alpr.interceptors.response.use(
  (response) => {
    isAlprConnected.value = true
    return response
  },
  (error) => {
    if (!error.response || error.code === 'ERR_NETWORK') {
      isAlprConnected.value = false
      // Notify.create({
      //   type: 'negative',
      //   message: 'ALPR server connection error. Please check your connection.',
      //   position: 'top',
      //   timeout: 3000
      // })
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api, alpr, axios }
