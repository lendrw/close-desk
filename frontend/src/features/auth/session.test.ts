import { afterEach, describe, expect, it } from 'vitest'

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from './session'

describe('auth session', () => {
  afterEach(() => {
    clearAuthTokens()
  })

  it('keeps access token in memory and refresh token in sessionStorage', () => {
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    expect(getAccessToken()).toBe('access-token')
    expect(getRefreshToken()).toBe('refresh-token')
    expect(sessionStorage.getItem('closedesk.accessToken')).toBeNull()
  })

  it('clears stored credentials', () => {
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    clearAuthTokens()

    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
