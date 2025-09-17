'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthForm from '../components/AuthForm'
import ScheduleForm from '../components/ScheduleForm'
import ScheduleList from '../components/ScheduleList'

export default function Home() {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Quiet Hours Scheduler</h1>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </div>
      <ScheduleForm />
      <ScheduleList />
    </div>
  )
}