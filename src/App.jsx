import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import CheckpointForm from './CheckpointForm'
import ProtectedRoute from './ProtectedRoute'
import PackingEntry from './PackingEntry'
import ProductionEntry from './ProductionEntry'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/checkpoint" element={
          <ProtectedRoute><CheckpointForm /></ProtectedRoute>
        } /><Route path="/packing" element={
  <ProtectedRoute><PackingEntry /></ProtectedRoute>
} />
        <Route path="/production" element={
          <ProtectedRoute><ProductionEntry /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App