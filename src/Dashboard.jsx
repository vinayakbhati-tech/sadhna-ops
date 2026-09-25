import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { supabase } from './supabaseClient'

const AREAS = [
  'Website labels', 'Pending orders', 'Website packing', 'Production',
  'RTD', 'Marketplace', 'Priority shipments', 'Dispatch', 'RTO',
  'Attendance', 'Receiving / inventory'
]

function Dashboard() {
  const [team, setTeam] = useState([])
  const [checkpoints, setCheckpoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: users } = await supabase
        .from('users')
        .select('full_name, role, active')
        .order('full_name')

      const today = new Date().toISOString().slice(0, 10)
      const { data: cps } = await supabase
        .from('checkpoint_updates')
        .select('area, checkpoint, submitted_at')
        .eq('business_date', today)

      setTeam(users || [])
      setCheckpoints(cps || [])
      setLoading(false)
    }
    loadData()
  }, [])

  function getCheckpointStatus(area, checkpoint) {
    const found = checkpoints.find(c => c.area === area && c.checkpoint === checkpoint)
    if (found && found.submitted_at) return 'Submitted'
    return 'Pending'
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard"><p>Loading live data...</p></div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Owner Dashboard</h1>
            <p>Live from Sadhna Ops database</p>
          </div>
        </div>

        <h2 className="section-title">Team</h2>
        <div className="card-grid">
          {team.map((person, index) => (
            <div className="staff-card" key={index}>
              <div className="avatar">{person.full_name.charAt(0)}</div>
              <h3>{person.full_name}</h3>
              <p className="tasks">{person.role}</p>
              <span className={`status ${person.active ? 'good' : 'warning'}`}>
                {person.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>

        <h2 className="section-title">Today's Checkpoints (2 PM / EOD)</h2>
        <div className="checkpoint-table">
          {AREAS.map((area) => (
            <div className="checkpoint-row" key={area}>
              <span className="checkpoint-area">{area}</span>
              <span className={`status ${getCheckpointStatus(area, '2PM') === 'Submitted' ? 'good' : 'warning'}`}>
                2PM: {getCheckpointStatus(area, '2PM')}
              </span>
              <span className={`status ${getCheckpointStatus(area, 'EOD') === 'Submitted' ? 'good' : 'warning'}`}>
                EOD: {getCheckpointStatus(area, 'EOD')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard