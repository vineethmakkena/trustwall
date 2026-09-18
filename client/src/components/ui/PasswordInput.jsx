import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function PasswordInput({ label, name, error, ...props }) {
  const [visible, setVisible] = useState(false)
  const inputId = `input-${name}`
  const errorId = `${inputId}-error`

  return (
    <div className="input-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="password-input">
        <input
          id={inputId}
          name={name}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <button
          className="password-input__toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="form-field-error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}
