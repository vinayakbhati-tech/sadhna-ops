import { Link, useNavigate } from 'react-router-dom'
import { getRole, logout } from './utils'

function Navbar() {
  const navigate = useNavigate()
  const role = getRole()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Sadhna Ops</h2>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Task Entry</Link>
        {role === 'admin' && <Link to="/admin">Admin</Link>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar