import { QueryClient } from '@tanstack/react-query'

import axios from 'axios'

// ✅ Fonction helper pour obtenir le token de manière sûre
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

// ✅ Configuration Axios
export const instance = axios.create({
  // baseURL: 'https://machine-learning-dsgl-2025-backend-887688967128.europe-west1.run.app/',
  baseURL: 'https://machine-learning-dsgl-2025-backend.onrender.com/',
  withCredentials: true, 
  timeout: 100000,
  headers: { 
    'Content-type': 'application/json',
  },
})

// ✅ Intercepteur pour ajouter le token dynamiquement à chaque requête
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Intercepteur pour gérer le refresh token automatiquement
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tenter de rafraîchir le token
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token')
          
          if (refreshToken) {
            const response = await axios.post(
              'http://localhost:8080/auth/refresh',
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            )

            const newAccessToken = response.data.data.access_token

            // Sauvegarder le nouveau token
            localStorage.setItem('access_token', newAccessToken)

            // Mettre à jour le header de la requête originale
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

            // Rejouer la requête
            return instance(originalRequest)
          }
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          localStorage.removeItem('auth_tokens')
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 0, /* 5 * 60 * 1000, */
    },
  },
})

