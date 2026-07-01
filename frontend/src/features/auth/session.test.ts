import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'

import { server } from '../../tests/msw/server'
import {
  clearAuthTokens,
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  loadCurrentUser,
  renewAccessToken,
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
    expect(getCurrentUser()).toBeNull()
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
    server.use(
      http.get('http://localhost:8000/api/auth/me/', ({ request }) => {
        expect(request.headers.get('authorization')).toBe(
          'Bearer new-access-token',
        )

        return HttpResponse.json({
          email: 'ada@example.com',
          id: 1,
          name: 'Ada Lovelace',
        })
      }),
    )

    await expect(restoreSession()).resolves.toBe(true)
    expect(getAccessToken()).toBe('new-access-token')
    expect(getCurrentUser()).toEqual({
      email: 'ada@example.com',
      id: 1,
      name: 'Ada Lovelace',
    })
    expect(getRefreshToken()).toBe('refresh-token')
  })

  it('does not restore session without a refresh token', async () => {
    await expect(restoreSession()).resolves.toBe(false)
    expect(getAccessToken()).toBeNull()
    expect(getCurrentUser()).toBeNull()
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
    expect(getCurrentUser()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('reuses an ongoing access token renewal request', async () => {
    let refreshRequests = 0
    sessionStorage.setItem('closedesk.refreshToken', 'refresh-token')

    server.use(
      http.post('http://localhost:8000/api/auth/token/refresh/', async () => {
        refreshRequests += 1
        await new Promise((resolve) => setTimeout(resolve, 20))

        return HttpResponse.json({
          access: 'new-access-token',
        })
      }),
    )

    await expect(
      Promise.all([renewAccessToken(), renewAccessToken()]),
    ).resolves.toEqual(['new-access-token', 'new-access-token'])
    expect(refreshRequests).toBe(1)
    expect(getAccessToken()).toBe('new-access-token')
    expect(getRefreshToken()).toBe('refresh-token')
  })

  it('clears credentials when access token renewal fails', async () => {
    saveAuthTokens({
      access: 'old-access-token',
      refresh: 'expired-refresh-token',
    })

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

    await expect(renewAccessToken()).rejects.toThrow()
    expect(getAccessToken()).toBeNull()
    expect(getCurrentUser()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('loads and keeps current user using the access token', async () => {
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    server.use(
      http.get('http://localhost:8000/api/auth/me/', ({ request }) => {
        expect(request.headers.get('authorization')).toBe('Bearer access-token')

        return HttpResponse.json({
          email: 'ada@example.com',
          id: 1,
          name: 'Ada Lovelace',
        })
      }),
    )

    await expect(loadCurrentUser()).resolves.toEqual({
      email: 'ada@example.com',
      id: 1,
      name: 'Ada Lovelace',
    })
    expect(getCurrentUser()).toEqual({
      email: 'ada@example.com',
      id: 1,
      name: 'Ada Lovelace',
    })
  })
})
