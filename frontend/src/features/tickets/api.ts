import { apiClient } from '../../shared/api/client'
import type {
  PaginatedResponse,
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../shared/types/api'

export type TicketOrdering = 'created_at' | '-created_at'

export type ListTicketsParams = {
  search?: string
  status?: TicketStatus
  priority?: TicketPriority
  ordering?: TicketOrdering
  page?: number
}

export type TicketFormData = {
  title: string
  description: string
  customer_name: string
  status: TicketStatus
  priority: TicketPriority
  due_date: string | null
}

export async function listTickets(params: ListTicketsParams = {}) {
  const response = await apiClient.get<PaginatedResponse<Ticket>>('/tickets/', {
    params,
  })

  return response.data
}

export async function createTicket(data: TicketFormData) {
  const response = await apiClient.post<Ticket>('/tickets/', data)

  return response.data
}

export async function getTicket(ticketId: number) {
  const response = await apiClient.get<Ticket>(`/tickets/${ticketId}/`)

  return response.data
}

export async function updateTicket(ticketId: number, data: TicketFormData) {
  const response = await apiClient.patch<Ticket>(`/tickets/${ticketId}/`, data)

  return response.data
}

export async function deleteTicket(ticketId: number) {
  await apiClient.delete(`/tickets/${ticketId}/`)
}
