import React, { useState } from 'react'
import { USERS_ENDPOINT } from '../constants'

export default function ProfilePage({ onUserChange }) {
  const [authView, setAuthView] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitAuth(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const endpoint =
        authView === 'login'
          ? `${USERS_ENDPOINT}/login`
          : `${USERS_ENDPOINT}/register`
      const body =
        authView === 'login'
          ? { phone, password }
          : { name, phone, password }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Authentication failed')
      }
      setUser(result.data)
      setAuthenticated(true)
      setPassword('')
      onUserChange?.(result.data)
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) {
    return (
      <div className="account-view">
        <div className="account-header">
          <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div>
            <strong>{user?.name || 'Account'}</strong>
            <div className="muted">{user?.phone || 'Apple Store customer'}</div>
          </div>
        </div>
        <button className="account-item">
          Personal Information <span>›</span>
        </button>
        <button className="account-item">
          My Orders <span>›</span>
        </button>
        <button className="account-item">
          Wishlist <span>›</span>
        </button>
        <button className="account-item">
          Settings <span>›</span>
        </button>
        <button
          className="logout-button"
          onClick={() => {
            setAuthenticated(false)
            setUser(null)
            onUserChange?.(null)
          }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <form className="auth-view" onSubmit={submitAuth}>
      <h1>{authView === 'register' ? 'Register' : 'Login'}</h1>
      {authView === 'register' && (
        <input
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      )}
      <input
        placeholder="Phone"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <div className="error-message">{error}</div>}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading
          ? 'Loading...'
          : authView === 'register'
          ? 'Register'
          : 'Login'}
      </button>
      <button
        className="link-button"
        type="button"
        onClick={() => {
          setAuthView(authView === 'register' ? 'login' : 'register')
          setError('')
        }}
      >
        {authView === 'register'
          ? 'Already have an account? Login'
          : 'Create account'}
      </button>
    </form>
  )
}
