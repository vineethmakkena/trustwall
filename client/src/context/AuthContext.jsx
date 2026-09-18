import { useEffect, useState } from 'react'
import api from '../lib/api'
import { AuthContext } from './AuthContext.js'

const getErrorMessage = (error) =>
  error.response?.data?.message || 'Something went wrong. Please try again.'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const checkAuth = async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true)
    }

    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      setError(null)
    } catch (requestError) {
      setUser(null)

      if (requestError.response?.status !== 401) {
        setError(getErrorMessage(requestError))
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/auth/register', formData)
      setUser(response.data.user)
      setSuccess(response.data.message || 'Account created successfully')
      return response.data
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }

  const login = async (credentials) => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/auth/login', credentials)
      setUser(response.data.user)
      setSuccess(response.data.message || 'Login successful')
      return response.data
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }

  const logout = async () => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/auth/logout')
      setUser(null)
      setSuccess(response.data.message || 'Logout successful')
      return response.data
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    queueMicrotask(() => checkAuth({ showLoading: false }))

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        actionLoading,
        error,
        success,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
