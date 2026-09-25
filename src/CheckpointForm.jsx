import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { supabase } from './supabaseClient'

const AREAS = [
  'Website labels', 'Pending orders', 'Website packing', 'Production',
  'RTD', 'Marketplace', 'Priority shipments', 'Dispatch', 'RTO',
  'Attendance', 'Receiving / inventory'
]

function CheckpointForm() {
  const [userId, setUserId] = useState(null)
  const [area, setArea] = useState(AREAS[0])
  const [checkpoint, setCheckpoint] = useState('2PM')
  const [summary, setSummary] = useState('')
  const [blockers, setBlockers] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: sessionData } = await supabase.auth.getSession()
      const authUserId = sessionData?.session?.user?.id
      if (!authUserId) return

      const { data } = await supabase
        .from('users')
        .select('user_id')
        .eq('auth_user_id', authUserId)
        .single()

      if (data) setUserId(data.user_id)
    }
    loadUser()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const today = new Date().toISOString().slice(0, 10)
    const dueTime = checkpoint === '2PM' ? '14:00:00' : '18:30:00'

    const { error } = await supabase.from('checkpoint_updates').upsert(
      {
        business_date: today,
        area: area,
        checkpoint: checkpoint,
        due_at: `${today}T${dueTime}+05:30`,
        submitted_at: new Date().toISOString(),
        summary: summary,
        blockers: blockers,
        created_by: userId,
        updated_by: userId,
      },
      { onConflict: 'business_date,area,checkpoint' }
    )

    setSaving(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Checkpoint submitted successfully!')
      setSummary('')
      setBlockers('')
    }
  }

  return (
    <>
      <Navbar />
      <div className="task-entry">
        <div className="task-entry-header">
          <div>
            <h1>Submit Checkpoint</h1>
            <p>2 PM / EOD update for your area</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label>Area</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Checkpoint</label>
            <select value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)}>
              <option value="2PM">2 PM</option>
              <option value="EOD">EOD</option>
            </select>
          </div>

          <div>
            <label>Summary</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. 320 orders packed, on track"
              required
            />
          </div>

          <div>
            <label>Blockers (if any)</label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. Short of 2 packing staff"
            />
          </div>

          <button type="submit" disabled={saving || !userId}>
            {saving ? 'Submitting...' : 'Submit Checkpoint'}
          </button>
        </form>

        {message && <p className="checkpoint-message">{message}</p>}
      </div>
    </>
  )
}

export default CheckpointForm