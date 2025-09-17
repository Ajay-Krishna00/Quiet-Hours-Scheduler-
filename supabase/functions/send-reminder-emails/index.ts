import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current time and 10 minutes from now
    const now = new Date()
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000)

    // Find quiet hours starting in the next 10 minutes that haven't been reminded
    const { data: upcomingHours, error: fetchError } = await supabaseClient
      .from('quiet_hours')
      .select(`
        id,
        title,
        start_time,
        end_time,
        description,
        reminder_sent,
        profiles!inner(email)
      `)
      .gte('start_time', now.toISOString())
      .lte('start_time', tenMinutesLater.toISOString())
      .eq('reminder_sent', false)

    if (fetchError) throw fetchError

    console.log(`Found ${upcomingHours?.length || 0} upcoming quiet hours`)

    // Send emails and update reminder status
    for (const quietHour of upcomingHours || []) {
      try {
        // Send email
        const emailResult = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Quiet Hours <noreply@yourdomain.com>',
            to: [quietHour.profiles.email],
            subject: `Reminder: "${quietHour.title}" starts in 10 minutes`,
            html: `
              <h2>Your quiet hour is starting soon!</h2>
              <p><strong>${quietHour.title}</strong></p>
              <p>Starting at: ${new Date(quietHour.start_time).toLocaleString()}</p>
              <p>Duration: ${new Date(quietHour.start_time).toLocaleString()} - ${new Date(quietHour.end_time).toLocaleString()}</p>
              ${quietHour.description ? `<p>Description: ${quietHour.description}</p>` : ''}
              <p>Get ready for some focused, quiet time! 🤫</p>
            `,
          }),
        })

        if (!emailResult.ok) {
          throw new Error(`Failed to send email: ${emailResult.statusText}`)
        }

        // Mark as reminded
        const { error: updateError } = await supabaseClient
          .from('quiet_hours')
          .update({ reminder_sent: true })
          .eq('id', quietHour.id)

        if (updateError) throw updateError

        console.log(`Reminder sent for: ${quietHour.title}`)
      } catch (error) {
        console.error(`Failed to process ${quietHour.title}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: upcomingHours?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})