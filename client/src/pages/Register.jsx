import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../hooks/useAuth'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  else if (form.name.trim().length < 2) errors.name = 'Enter at least 2 characters.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Password is required.'
  else if (!passwordPattern.test(form.password)) errors.password = 'Use 8+ characters with uppercase, lowercase, and a number.'
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const { register, actionLoading } = useAuth()
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
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    }
  }

  return (
    <AuthLayout eyebrow="Your workspace" title="Start with your proof." intro="Create an owner account and make your first wall." footer={<p className="auth-card__switch">Already have an account? <Link to="/login">Sign in</Link></p>}>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <InputField label="Name" name="name" value={form.name} onChange={updateField} autoComplete="name" error={errors.name} />
        <InputField label="Email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" error={errors.email} />
        <PasswordInput label="Password" name="password" value={form.password} onChange={updateField} autoComplete="new-password" error={errors.password} />
        <PasswordInput label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={updateField} autoComplete="new-password" error={errors.confirmPassword} />
        {submitError && <p className="form-message form-message--error" role="alert">{submitError}</p>}
        <button className="button button--coral button--full" type="submit" disabled={actionLoading}>
          {actionLoading ? 'Creating account...' : 'Create account'} <ArrowRight size={17} />
        </button>
      </form>
    </AuthLayout>
  )
}
