import sadhnaLogo from './assets/sadhna-logo.png'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function Navbar() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: sessionData } = await supabase.auth.getSession()
      const authUserId = sessionData?.session?.user?.id
      if (!authUserId) return

      const { data } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('auth_user_id', authUserId)
        .single()

      setProfile(data)
    }
    loadProfile()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <img src={sadhnaLogo} alt="Sadhna.co" className="navbar-logo-img" />
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/checkpoint">Submit Checkpoint</Link><Link to="/packing">Packing Entry</Link>
        {profile && (
          <span className="navbar-user">{profile.full_name} · {profile.role}</span>
        )}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar