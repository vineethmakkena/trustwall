import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register, actionLoading, error } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [formError, setFormError] = useState(null)

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError(null)
    try {
      if (isLogin) await login({ email: form.email, password: form.password })
      else await register(form)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (submitError) {
      setFormError(submitError.message)
    }
  }

  const message = formError || error

  return (
    <main className="auth-page">
      <div className="auth-page__aside">
        <Link className="brand brand--light" to="/"><span className="brand__mark"><ShieldCheck size={19} /></span>TrustWall</Link>
        <div><span className="eyebrow eyebrow--light">A better kind of proof</span><h1>Make trust part of the room.</h1><p>Collect the perspective that makes your work easier to believe.</p></div>
        <span className="auth-page__footer">Built for customer-led teams.</span>
      </div>
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="eyebrow">Your workspace</span>
        <h2 id="auth-title">{isLogin ? 'Welcome back.' : 'Start with your proof.'}</h2>
        <p className="auth-card__intro">{isLogin ? 'Sign in to keep your customer stories moving.' : 'Create an owner account and make your first wall.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && <label>Name<input name="name" value={form.name} onChange={handleChange} autoComplete="name" required /></label>}
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={8} required />{!isLogin && <small>At least 8 characters, with upper, lower, and a number.</small>}</label>
          {message && <p className="form-message form-message--error" role="alert">{message}</p>}
          <button className="button button--coral button--full" type="submit" disabled={actionLoading}>{actionLoading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></button>
        </form>
        <p className="auth-card__switch">{isLogin ? 'New to TrustWall?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p>
      </section>
    </main>
  )
}
