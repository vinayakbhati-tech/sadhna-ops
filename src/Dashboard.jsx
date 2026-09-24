import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { getStaff, getEntries, exportEntriesToCSV } from './utils'

function Dashboard() {
  const [staffData, setStaffData] = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setStaffData(getStaff())
    setEntries(getEntries())
  }, [])

  function getStatus(count) {
    if (count === 0) return "Needs Attention"
    if (count < 3) return "Behind"
    return "On Track"
  }

  function getTaskCount(staffName) {
    return entries.filter((entry) => entry.staffName === staffName).length
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Staff Performance</h1>
            <p>Today's production status</p>
          </div>
          <button className="export-btn" onClick={() => exportEntriesToCSV(entries)}>
            Export CSV
          </button>
        </div>

        <div className="card-grid">
          {staffData.map((staff, index) => {
            const count = getTaskCount(staff.name)
            const status = getStatus(count)
            return (
              <div className="staff-card" key={index}>
                <div className="avatar">{staff.name.charAt(0)}</div>
                <h3>{staff.name}</h3>
                <p className="tasks">{count} tasks completed</p>
                <span className={`status ${status === "On Track" ? "good" : "warning"}`}>
                  {status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Dashboard