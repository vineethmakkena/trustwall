export default function InputField({ label, name, error, ...props }) {
  const inputId = `input-${name}`
  const errorId = `${inputId}-error`

  return (
    <div className="input-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <p className="form-field-error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}
