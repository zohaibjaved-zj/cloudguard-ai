import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, BarChart3, Bell, Info, Menu, X } from 'lucide-react'

const links = [
  { to: '/',           label: 'Home',       icon: Shield },
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/comparison', label: 'Comparison', icon: BarChart3 },
  { to: '/alerts',     label: 'Alerts',     icon: Bell },
  { to: '/about',      label: 'About',      icon: Info },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Shield size={28} color="#3b82f6" />
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>CloudGuard <span style={{ color: '#3b82f6' }}>AI</span></span>
        </Link>

        <div style={{ display: 'flex', gap: 8 }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
              background: pathname === to ? '#1e40af' : 'transparent',
              color: pathname === to ? '#fff' : '#94a3b8',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}