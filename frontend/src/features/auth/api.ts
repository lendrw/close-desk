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

export type PasswordResetRequestPayload = {
  email: string
}

export type PasswordResetRequestResponse = {
  message: string
}

export type PasswordResetConfirmPayload = {
  uid: string
  token: string
  password: string
}

export type PasswordResetConfirmResponse = {
  message: string
}

export type EmailVerificationConfirmPayload = {
  uid: string
  token: string
}

export type EmailVerificationConfirmResponse = {
  message: string
}

export async function login(credentials: LoginCredentials) {
  const response = await apiClient.post<TokenPair>('/auth/token/', credentials)

  return response.data
}

export async function fetchCurrentUser() {
  const response = await apiClient.get<User>('/auth/me/')

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

export async function requestPasswordReset(
  payload: PasswordResetRequestPayload,
) {
  const response = await apiClient.post<PasswordResetRequestResponse>(
    '/auth/password-reset/',
    payload,
  )

  return response.data
}

export async function confirmPasswordReset(
  payload: PasswordResetConfirmPayload,
) {
  const response = await apiClient.post<PasswordResetConfirmResponse>(
    '/auth/password-reset/confirm/',
    payload,
  )

  return response.data
}

export async function confirmEmailVerification(
  payload: EmailVerificationConfirmPayload,
) {
  const response = await apiClient.post<EmailVerificationConfirmResponse>(
    '/auth/email-verification/confirm/',
    payload,
  )

  return response.data
}
