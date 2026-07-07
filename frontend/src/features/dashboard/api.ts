import { apiClient } from '../../shared/api/client'
import type { DashboardSummary } from '../../shared/types/api'

export async function fetchDashboardSummary() {
  const response = await apiClient.get<DashboardSummary>('/dashboard/summary/')

  return response.data
}
