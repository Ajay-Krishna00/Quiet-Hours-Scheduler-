'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {message && <div className={message.includes('Check') ? 'success' : 'error'}>{message}</div>}
      <form onSubmit={handleAuth}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
        <button type="button" className="secondary" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have account? Sign In' : 'Need account? Sign Up'}
        </button>
      </form>
    </div>
  )
}