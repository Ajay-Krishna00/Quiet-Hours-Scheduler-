'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
    
    // Subscribe to changes
    const subscription = supabase
      .channel('quiet_hours_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quiet_hours' },
        () => fetchSchedules()
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  async function fetchSchedules() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('quiet_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (error: any) {
      console.error('Error fetching schedules:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSchedule(id: string) {
    try {
      const { error } = await supabase
        .from('quiet_hours')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error('Error deleting schedule:', error.message)
    }
  }

  if (loading) return <div>Loading schedules...</div>

  return (
    <div>
      <h3>Your Quiet Hours ({schedules.length})</h3>
      {schedules.length === 0 ? (
        <p>No quiet hours scheduled yet. Create your first one above!</p>
      ) : (
        schedules.map((schedule: any) => (
          <div key={schedule.id} className="schedule-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>{schedule.title}</h4>
                <p style={{ margin: '5px 0' }}>
                  <strong>Start:</strong> {new Date(schedule.start_time).toLocaleString()}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>End:</strong> {new Date(schedule.end_time).toLocaleString()}
                </p>
                {schedule.description && (
                  <p style={{ margin: '10px 0 0 0', fontStyle: 'italic' }}>{schedule.description}</p>
                )}
              </div>
              <button 
                className="secondary" 
                onClick={() => deleteSchedule(schedule.id)}
                style={{ marginLeft: '15px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}