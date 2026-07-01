import { refreshAccessToken } from './api'
import type { TokenPair } from './api'

const REFRESH_TOKEN_STORAGE_KEY = 'closedesk.refreshToken'

let accessToken: string | null = null

export function saveAuthTokens(tokens: TokenPair) {
  accessToken = tokens.access
  sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh)
}

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function clearAuthTokens() {
  accessToken = null
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export async function renewAccessToken() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    accessToken = null
    return null
  }

  const tokens = await refreshAccessToken(refreshToken)
  accessToken = tokens.access

  return accessToken
}

export async function restoreSession() {
  try {
    return Boolean(await renewAccessToken())
  } catch {
    clearAuthTokens()
    return false
  }
}
