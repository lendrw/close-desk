type TextFieldProps = {
  autoComplete?: string
  error?: string
  id: string
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}

export function TextField({
  autoComplete,
  error,
  id,
  label,
  onChange,
  type = 'text',
  value,
}: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        autoComplete={autoComplete}
        className="form-input"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
      {error ? (
        <p className="form-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
