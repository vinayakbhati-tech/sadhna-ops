import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { supabase } from './supabaseClient'

function PackingEntry() {
  const [userId, setUserId] = useState(null)
  const [stations, setStations] = useState([])
  const [slots, setSlots] = useState([])
  const [stationId, setStationId] = useState('')
  const [slotId, setSlotId] = useState('')
  const [openingPending, setOpeningPending] = useState('')
  const [labelsAdded, setLabelsAdded] = useState('')
  const [packedOrders, setPackedOrders] = useState('')
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
          .select('user_id')
          .eq('auth_user_id', authUserId)
          .single()
        if (userRow) setUserId(userRow.user_id)
      }

      const { data: stationRows } = await supabase
        .from('stations')
        .select('station_id, station_name')
        .eq('order_source', 'website')
        .eq('active', true)

      const { data: slotRows } = await supabase
        .from('time_slots')
        .select('slot_id, slot_label')
        .order('slot_id')

      setStations(stationRows || [])
      setSlots(slotRows || [])
      if (stationRows && stationRows.length > 0) setStationId(stationRows[0].station_id)
      if (slotRows && slotRows.length > 0) setSlotId(slotRows[0].slot_id)

      loadTodayEntries()
    }
    loadInitial()
  }, [])

  async function loadTodayEntries() {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('packing_hourly')
      .select('station_id, slot_id, opening_pending, labels_added, packed_orders')
      .eq('business_date', today)
      .order('slot_id')

    setTodayEntries(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const today = new Date().toISOString().slice(0, 10)

    const { error } = await supabase.from('packing_hourly').upsert(
      {
        business_date: today,
        station_id: stationId,
        slot_id: slotId,
        opening_pending: Number(openingPending) || 0,
        labels_added: Number(labelsAdded) || 0,
        packed_orders: Number(packedOrders) || 0,
        created_by: userId,
        updated_by: userId,
      },
      { onConflict: 'business_date,station_id,slot_id' }
    )

    setSaving(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Entry saved!')
      setOpeningPending('')
      setLabelsAdded('')
      setPackedOrders('')
      loadTodayEntries()
    }
  }

  function stationName(id) {
    const s = stations.find((x) => x.station_id === id)
    return s ? s.station_name : id
  }

  function slotLabel(id) {
    const s = slots.find((x) => x.slot_id === id)
    return s ? s.slot_label : id
  }

  return (
    <>
      <Navbar />
      <div className="task-entry">
        <div className="task-entry-header">
          <div>
            <h1>Website Packing Entry</h1>
            <p>Log hourly packing for each active station</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label>Station</label>
            <select value={stationId} onChange={(e) => setStationId(e.target.value)} required>
              {stations.map((s) => (
                <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Hour Slot</label>
            <select value={slotId} onChange={(e) => setSlotId(e.target.value)} required>
              {slots.map((s) => (
                <option key={s.slot_id} value={s.slot_id}>{s.slot_label}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Opening Pending</label>
            <input type="number" value={openingPending} onChange={(e) => setOpeningPending(e.target.value)} placeholder="e.g. 40" required />
          </div>

          <div>
            <label>Labels Added</label>
            <input type="number" value={labelsAdded} onChange={(e) => setLabelsAdded(e.target.value)} placeholder="e.g. 60" required />
          </div>

          <div>
            <label>Packed Orders</label>
            <input type="number" value={packedOrders} onChange={(e) => setPackedOrders(e.target.value)} placeholder="e.g. 85" required />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </form>

        {message && <p className="checkpoint-message">{message}</p>}

        <h2 className="section-title">Today's Entries</h2>
        {todayEntries.length === 0 && <p className="empty">No entries yet today</p>}
        {todayEntries.map((entry, index) => (
          <div className="entry-card" key={index}>
            <strong>{stationName(entry.station_id)} — {slotLabel(entry.slot_id)}</strong>
            <span>Opening: {entry.opening_pending} · Added: {entry.labels_added} · Packed: {entry.packed_orders}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default PackingEntry