import axios, { AxiosHeaders } from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let accessTokenProvider: (() => string | null) | null = null

export function setAccessTokenProvider(provider: () => string | null) {
  accessTokenProvider = provider
}

apiClient.interceptors.request.use((config) => {
  const accessToken = accessTokenProvider?.()

  if (accessToken) {
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return config
})
