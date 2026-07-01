import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'

import { server } from '../../tests/msw/server'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  restoreSession,
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

  it('restores session using the stored refresh token', async () => {
    sessionStorage.setItem('closedesk.refreshToken', 'refresh-token')

    server.use(
      http.post('http://localhost:8000/api/auth/token/refresh/', async () => {
        return HttpResponse.json({
          access: 'new-access-token',
        })
      }),
    )

    await expect(restoreSession()).resolves.toBe(true)
    expect(getAccessToken()).toBe('new-access-token')
    expect(getRefreshToken()).toBe('refresh-token')
  })

  it('does not restore session without a refresh token', async () => {
    await expect(restoreSession()).resolves.toBe(false)
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('clears credentials when session restoration fails', async () => {
    sessionStorage.setItem('closedesk.refreshToken', 'expired-refresh-token')

    server.use(
      http.post('http://localhost:8000/api/auth/token/refresh/', async () => {
        return HttpResponse.json(
          {
            error: {
              code: 'authentication_error',
              details: {},
              message: 'Token inválido.',
            },
          },
          { status: 401 },
        )
      }),
    )

    await expect(restoreSession()).resolves.toBe(false)
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
