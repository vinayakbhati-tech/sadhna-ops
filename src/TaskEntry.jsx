import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { getStaff, getEntries, saveEntries, exportEntriesToCSV } from './utils'

function TaskEntry() {
  const [staffList, setStaffList] = useState([])
  const [staffName, setStaffName] = useState('')
  const [taskName, setTaskName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setStaffList(getStaff())
    setEntries(getEntries())
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    const now = new Date()

    const newEntry = {
      staffName: staffName,
      taskName: taskName,
      quantity: quantity,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    saveEntries(updatedEntries)

    setStaffName('')
    setTaskName('')
    setQuantity('')
  }

  return (
    <>
      <Navbar />
      <div className="task-entry">
        <div className="task-entry-header">
          <div>
            <h1>Production Entry</h1>
            <p>Log today's production work</p>
          </div>
          <button className="export-btn" onClick={() => exportEntriesToCSV(entries)}>
            Export CSV
          </button>
        </div>

        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label>Staff Name</label>
            <select
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              required
            >
              <option value="">Select staff member</option>
              {staffList.map((staff, index) => (
                <option key={index} value={staff.name}>{staff.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Task / Product Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Box Packing"
              required
            />
          </div>

          <div>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 20"
              required
            />
          </div>

          <button type="submit">Add Entry</button>
        </form>

        <div className="entry-list">
          <h2>Recent Entries</h2>
          {entries.length === 0 && <p className="empty">No entries yet</p>}
          {entries.map((entry, index) => (
            <div className="entry-card" key={index}>
              <strong>{entry.staffName}</strong>
              <span>{entry.taskName}</span>
              <span>Qty: {entry.quantity}</span>
              <span className="time">{entry.date} - {entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TaskEntry