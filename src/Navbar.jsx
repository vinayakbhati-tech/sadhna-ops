import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Sadhna Ops</h2>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Task Entry</Link>
      </div>
    </nav>
  )
}

export default Navbar