import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import TaskEntry from './TaskEntry'
import AdminPanel from './AdminPanel'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute><TaskEntry /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App