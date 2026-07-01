import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { apiClient } from './client'
import { server } from '../../tests/msw/server'

describe('apiClient', () => {
  it('uses the configured API base URL', async () => {
    server.use(
      http.get('http://localhost:8000/api/health/', () => {
        return HttpResponse.json({ status: 'ok' })
      }),
    )

    const response = await apiClient.get('/health/')

    expect(response.data).toEqual({ status: 'ok' })
  })
})
