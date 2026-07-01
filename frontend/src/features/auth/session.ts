import { setAccessTokenProvider } from '../../shared/api/client'
import type { User } from '../../shared/types/api'
import { fetchCurrentUser, refreshAccessToken } from './api'
import type { TokenPair } from './api'

const REFRESH_TOKEN_STORAGE_KEY = 'closedesk.refreshToken'

let accessToken: string | null = null
let accessTokenRenewalPromise: Promise<string | null> | null = null
let currentUser: User | null = null

setAccessTokenProvider(() => accessToken)

export function saveAuthTokens(tokens: TokenPair) {
  accessToken = tokens.access
  sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh)
}

export function getAccessToken() {
  return accessToken
}

export function getCurrentUser() {
  return currentUser
}

export function setCurrentUser(user: User | null) {
  currentUser = user
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function clearAuthTokens() {
  accessToken = null
  accessTokenRenewalPromise = null
  currentUser = null
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function logout() {
  clearAuthTokens()
}

export async function loadCurrentUser() {
  currentUser = await fetchCurrentUser()

  return currentUser
}

export async function renewAccessToken() {
  if (accessTokenRenewalPromise) {
    return accessTokenRenewalPromise
  }

  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    accessToken = null
    return null
  }

  accessTokenRenewalPromise = refreshAccessToken(refreshToken)
    .then((tokens) => {
      accessToken = tokens.access

      return accessToken
    })
    .catch((error: unknown) => {
      clearAuthTokens()

      throw error
    })
    .finally(() => {
      accessTokenRenewalPromise = null
    })

  return accessTokenRenewalPromise
}

export async function restoreSession() {
  try {
    const renewedAccessToken = await renewAccessToken()

    if (!renewedAccessToken) {
      return false
    }

    await loadCurrentUser()

    return true
  } catch {
    clearAuthTokens()
    return false
  }
}
