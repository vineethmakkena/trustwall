import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../hooks/useAuth'

const initialForm = { email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Password is required.'
  return errors
}

export default function Login() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const { login, actionLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    setSubmitError(null)
    if (Object.keys(validationErrors).length) return

    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    }
  }

  return (
    <AuthLayout eyebrow="Your workspace" title="Welcome back." intro="Sign in to keep your customer stories moving." footer={<p className="auth-card__switch">New to TrustWall? <Link to="/register">Create an account</Link></p>}>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <InputField label="Email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" error={errors.email} />
        <PasswordInput label="Password" name="password" value={form.password} onChange={updateField} autoComplete="current-password" error={errors.password} />
        {submitError && <p className="form-message form-message--error" role="alert">{submitError}</p>}
        <button className="button button--coral button--full" type="submit" disabled={actionLoading}>
          {actionLoading ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} />
        </button>
      </form>
    </AuthLayout>
  )
}
