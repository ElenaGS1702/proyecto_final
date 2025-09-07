import axios from 'axios'
import useAuth from '../hooks/useAuth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000)
})

http.interceptors.request.use((config) => {
  const { token } = useAuth.getState()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Error de red'
    return Promise.reject(new Error(message))
  }
)

export default http
