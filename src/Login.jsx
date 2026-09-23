import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <h1>Sadhna Ops</h1>
      <p>Complete Operations, At one place</p>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input type="email" placeholder="your company email" />
        </div>

        <div>
          <label>Password</label>
          <input type="password" placeholder="type your password" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login