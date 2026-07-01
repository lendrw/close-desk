export type User = {
  id: number
  name: string
  email: string
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Ticket = {
  id: number
  title: string
  description: string
  customer_name: string
  status: TicketStatus
  priority: TicketPriority
  due_date: string | null
  created_at: string
  updated_at: string
  created_by: number
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type DashboardSummary = {
  total: number
  by_status: Record<TicketStatus, number>
  urgent: number
}

export type ApiError = {
  error: {
    code: string
    message: string
    details: Record<string, unknown>
  }
}
