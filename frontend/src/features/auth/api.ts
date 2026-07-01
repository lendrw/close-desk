import { apiClient } from '../../shared/api/client'
import type { User } from '../../shared/types/api'

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterPayload = LoginCredentials & {
  name: string
}

export type TokenPair = {
  access: string
  refresh: string
}

export type RefreshTokenResponse = {
  access: string
}

export async function login(credentials: LoginCredentials) {
  const response = await apiClient.post<TokenPair>('/auth/token/', credentials)

  return response.data
}

export async function refreshAccessToken(refresh: string) {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/auth/token/refresh/',
    { refresh },
  )

  return response.data
}

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post<User>('/auth/register/', payload)

  return response.data
}
