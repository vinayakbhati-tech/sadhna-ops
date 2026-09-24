import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setRole } from './utils'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRoleValue] = useState('staff')

  function handleLogin(e) {
    e.preventDefault()
    setRole(role)
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sadhna Ops</h1>
        <p>Complete Operations, At one place</p>

        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your company email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="type your password"
              required
            />
          </div>

          <div>
            <label>Login as</label>
            <select value={role} onChange={(e) => setRoleValue(e.target.value)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="demo-note">Demo mode: any email/password works</p>
      </div>
    </div>
  )
}

export default Login