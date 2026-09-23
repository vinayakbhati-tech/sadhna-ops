import { useState } from 'react'
import Navbar from './Navbar'

function TaskEntry() {
  const [staffName, setStaffName] = useState('')
  const [taskName, setTaskName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [entries, setEntries] = useState([])

  function handleSubmit(e) {
    e.preventDefault()

    const newEntry = {
      staffName: staffName,
      taskName: taskName,
      quantity: quantity,
      time: new Date().toLocaleTimeString()
    }

    setEntries([newEntry, ...entries])

    setStaffName('')
    setTaskName('')
    setQuantity('')
  }

  return (
    <>
      <Navbar />
      <div className="task-entry">
        <h1>Production Entry</h1>
        <p>Log today's production work</p>

        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label>Staff Name</label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
            />
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
          <h2>Today's Entries</h2>
          {entries.length === 0 && <p className="empty">No entries yet</p>}
          {entries.map((entry, index) => (
            <div className="entry-card" key={index}>
              <strong>{entry.staffName}</strong>
              <span>{entry.taskName}</span>
              <span>Qty: {entry.quantity}</span>
              <span className="time">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TaskEntry