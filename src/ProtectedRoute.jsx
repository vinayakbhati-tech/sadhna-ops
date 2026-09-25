import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!loggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute