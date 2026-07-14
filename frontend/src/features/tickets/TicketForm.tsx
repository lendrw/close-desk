import { type FormEvent, useState } from 'react'

import type { TicketPriority, TicketStatus } from '../../shared/types/api'
import type { TicketFormData } from './api'

type TicketFormErrors = Partial<Record<keyof TicketFormData, string>>

type TicketFormProps = {
  defaultValues?: Partial<TicketFormData>
  isSubmitting?: boolean
  onSubmit: (data: TicketFormData) => void
  submitLabel: string
}

const defaultFormValues: TicketFormData = {
  customer_name: '',
  description: '',
  due_date: null,
  priority: 'medium',
  status: 'open',
  title: '',
}

const statusOptions: Array<{ label: string; value: TicketStatus }> = [
  { label: 'Aberto', value: 'open' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Fechado', value: 'closed' },
]

const priorityOptions: Array<{ label: string; value: TicketPriority }> = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
]

function validateTicketForm(values: TicketFormData) {
  const errors: TicketFormErrors = {}

  if (values.title.trim().length < 3) {
    errors.title = 'Informe um título com pelo menos 3 caracteres.'
  }

  if (values.description.trim().length < 10) {
    errors.description = 'Informe uma descrição com pelo menos 10 caracteres.'
  }

  if (values.customer_name.trim().length < 2) {
    errors.customer_name = 'Informe o nome do cliente.'
  }

  if (!values.status) {
    errors.status = 'Selecione um status.'
  }

  if (!values.priority) {
    errors.priority = 'Selecione uma prioridade.'
  }

  return errors
}

function getErrorId(field: keyof TicketFormData) {
  return `ticket-${field}-error`
}

function getFieldId(field: keyof TicketFormData) {
  return `ticket-${field}`
}

export function TicketForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
  submitLabel,
}: TicketFormProps) {
  const [errors, setErrors] = useState<TicketFormErrors>({})
  const [values, setValues] = useState<TicketFormData>({
    ...defaultFormValues,
    ...defaultValues,
  })

  function updateValue<Field extends keyof TicketFormData>(
    field: Field,
    value: TicketFormData[Field],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextValues: TicketFormData = {
      ...values,
      customer_name: values.customer_name.trim(),
      description: values.description.trim(),
      due_date: values.due_date || null,
      title: values.title.trim(),
    }
    const nextErrors = validateTicketForm(nextValues)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit(nextValues)
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('title')}>
          Título
        </label>
        <input
          aria-describedby={errors.title ? getErrorId('title') : undefined}
          aria-invalid={Boolean(errors.title)}
          className="form-input"
          id={getFieldId('title')}
          onChange={(event) => {
            updateValue('title', event.target.value)
          }}
          type="text"
          value={values.title}
        />
        {errors.title ? (
          <span className="form-error" id={getErrorId('title')}>
            {errors.title}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('description')}>
          Descrição
        </label>
        <textarea
          aria-describedby={
            errors.description ? getErrorId('description') : undefined
          }
          aria-invalid={Boolean(errors.description)}
          className="form-input ticket-form-textarea"
          id={getFieldId('description')}
          onChange={(event) => {
            updateValue('description', event.target.value)
          }}
          value={values.description}
        />
        {errors.description ? (
          <span className="form-error" id={getErrorId('description')}>
            {errors.description}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('customer_name')}>
          Cliente
        </label>
        <input
          aria-describedby={
            errors.customer_name ? getErrorId('customer_name') : undefined
          }
          aria-invalid={Boolean(errors.customer_name)}
          className="form-input"
          id={getFieldId('customer_name')}
          onChange={(event) => {
            updateValue('customer_name', event.target.value)
          }}
          type="text"
          value={values.customer_name}
        />
        {errors.customer_name ? (
          <span className="form-error" id={getErrorId('customer_name')}>
            {errors.customer_name}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('status')}>
          Status
        </label>
        <select
          aria-describedby={errors.status ? getErrorId('status') : undefined}
          aria-invalid={Boolean(errors.status)}
          className="form-input"
          id={getFieldId('status')}
          onChange={(event) => {
            updateValue('status', event.target.value as TicketStatus)
          }}
          value={values.status}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status ? (
          <span className="form-error" id={getErrorId('status')}>
            {errors.status}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('priority')}>
          Prioridade
        </label>
        <select
          aria-describedby={
            errors.priority ? getErrorId('priority') : undefined
          }
          aria-invalid={Boolean(errors.priority)}
          className="form-input"
          id={getFieldId('priority')}
          onChange={(event) => {
            updateValue('priority', event.target.value as TicketPriority)
          }}
          value={values.priority}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.priority ? (
          <span className="form-error" id={getErrorId('priority')}>
            {errors.priority}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={getFieldId('due_date')}>
          Prazo
        </label>
        <input
          className="form-input"
          id={getFieldId('due_date')}
          onChange={(event) => {
            updateValue('due_date', event.target.value || null)
          }}
          type="date"
          value={values.due_date ?? ''}
        />
      </div>

      <button
        className="app-link auth-submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
