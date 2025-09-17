'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ScheduleForm() {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('quiet_hours')
        .insert([
          {
            user_id: user.id,
            title,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            description
          }
        ])

      if (error) throw error

      setMessage('Quiet hour scheduled successfully!')
      setTitle('')
      setStartTime('')
      setEndTime('')
      setDescription('')
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>Schedule New Quiet Hours</h3>
      {message && <div className={message.includes('successfully') ? 'success' : 'error'}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Study session, meditation, etc."
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description (optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will you be doing during this quiet time?"
            rows={3}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Quiet Hours'}
        </button>
      </form>
    </div>
  )
}