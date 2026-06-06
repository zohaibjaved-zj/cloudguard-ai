import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Comparison from './pages/Comparison'
import Alerts from './pages/Alerts'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/alerts"     element={<Alerts />} />
          <Route path="/about"      element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}