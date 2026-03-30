import axios from 'axios'

const api = axios.create({
  baseURL:         '/api',
  withCredentials: true,
})

// Auto-attach JWT token on every request — no manual header needed at call sites
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

export default api
