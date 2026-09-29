import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { supabase } from './supabaseClient'

// production_batches has no business_date column, so "today" is worked out
// from created_at, using midnight in India time (IST, +05:30).
function todayStartIST() {
  const istDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return `${istDate}T00:00:00+05:30`
}

function ProductionEntry() {
  const [userName, setUserName] = useState('')
  const [batchNo, setBatchNo] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [batchOutput, setBatchOutput] = useState('')
  const [remarks, setRemarks] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [todayEntries, setTodayEntries] = useState([])

  useEffect(() => {
    async function loadInitial() {
      const { data: sessionData } = await supabase.auth.getSession()
      const authUserId = sessionData?.session?.user?.id
      if (authUserId) {
        const { data: userRow } = await supabase
          .from('users')
          .select('full_name')
          .eq('auth_user_id', authUserId)
          .single()
        if (userRow) setUserName(userRow.full_name)
      }

      loadTodayEntries()
    }
    loadInitial()
  }, [])

  async function loadTodayEntries() {
    const { data } = await supabase
      .from('production_batches')
      .select('id, batch_no, start_time, end_time, batch_output, remarks, created_by')
      .gte('created_at', todayStartIST())
      .order('batch_no')

    setTodayEntries(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (endTime <= startTime) {
      setMessage('Error: End time must be after start time')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('production_batches').insert({
      batch_no: Number(batchNo),
      start_time: startTime,
      end_time: endTime,
      batch_output: Number(batchOutput),
      remarks: remarks.trim() || null,
      created_by: userName,
      updated_by: userName,
    })

    setSaving(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Batch saved!')
      setBatchNo('')
      setStartTime('')
      setEndTime('')
      setBatchOutput('')
      setRemarks('')
      loadTodayEntries()
    }
  }

  // Supabase returns time as "HH:MM:SS" — show just "HH:MM"
  function shortTime(t) {
    return t ? t.slice(0, 5) : '—'
  }

  return (
    <>
      <Navbar />
      <div className="task-entry">
        <div className="task-entry-header">
          <div>
            <h1>Production Entry</h1>
            <p>Log each production batch with its timing and output</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label>Batch No.</label>
            <input type="number" min="1" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} placeholder="e.g. 1" required />
          </div>

          <div className="production-time-row">
            <div>
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div>
              <label>End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div>
            <label>Batch Output</label>
            <input type="number" min="0" step="any" value={batchOutput} onChange={(e) => setBatchOutput(e.target.value)} placeholder="e.g. 250" required />
          </div>

          <div>
            <label>Remarks (optional)</label>
            <textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Anything to note about this batch" />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Batch'}
          </button>
        </form>

        {message && (
          <p className={message.startsWith('Error') ? 'checkpoint-message production-error' : 'checkpoint-message'}>
            {message}
          </p>
        )}

        <h2 className="section-title">Today's Batches</h2>
        {todayEntries.length === 0 && <p className="empty">No batches yet today</p>}
        {todayEntries.map((entry) => (
          <div className="entry-card" key={entry.id}>
            <strong>Batch {entry.batch_no} — {shortTime(entry.start_time)} to {shortTime(entry.end_time)}</strong>
            <span>Output: {entry.batch_output}</span>
            {entry.remarks && <span className="time">{entry.remarks}</span>}
            {entry.created_by && <span className="time">By {entry.created_by}</span>}
          </div>
        ))}
      </div>
    </>
  )
}

export default ProductionEntry
