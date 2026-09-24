import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { getStaff, saveStaff } from './utils'

function AdminPanel() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [staffList, setStaffList] = useState([])

  useEffect(() => {
    setStaffList(getStaff())
  }, [])

  function handleAddStaff(e) {
    e.preventDefault()

    const newStaff = { name: name, role: role }
    const updatedList = [...staffList, newStaff]
    setStaffList(updatedList)
    saveStaff(updatedList)

    setName('')
    setRole('')
  }

  function handleRemoveStaff(indexToRemove) {
    const updatedList = staffList.filter((staff, index) => index !== indexToRemove)
    setStaffList(updatedList)
    saveStaff(updatedList)
  }

  return (
    <>
      <Navbar />
      <div className="admin-panel">
        <h1>Admin Panel</h1>
        <p>Manage your staff members</p>

        <form onSubmit={handleAddStaff} className="admin-form">
          <div>
            <label>Staff Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              required
            />
          </div>

          <div>
            <label>Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Machine Operator"
              required
            />
          </div>

          <button type="submit">Add Staff</button>
        </form>

        <div className="staff-list-section">
          <h2>Current Staff ({staffList.length})</h2>
          {staffList.map((staff, index) => (
            <div className="staff-row" key={index}>
              <div>
                <strong>{staff.name}</strong>
                <span className="role">{staff.role}</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveStaff(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminPanel