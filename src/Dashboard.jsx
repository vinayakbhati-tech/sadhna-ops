import Navbar from './Navbar'

const staffData = [
  { name: "Ramesh Kumar", tasksToday: 12, status: "On Track" },
  { name: "Rohit Chaudhary", tasksToday: 8, status: "Behind" },
  { name: "Sahil Bhiwani", tasksToday: 15, status: "On Track" },
  { name: "Chakra Shah", tasksToday: 5, status: "Needs Attention" },
]

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Staff Performance</h1>
        <p>Today's production status</p>

        <div className="card-grid">
          {staffData.map((staff, index) => (
            <div className="staff-card" key={index}>
              <div className="avatar">{staff.name.charAt(0)}</div>
              <h3>{staff.name}</h3>
              <p className="tasks">{staff.tasksToday} tasks completed</p>
              <span className={`status ${staff.status === "On Track" ? "good" : "warning"}`}>
                {staff.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard