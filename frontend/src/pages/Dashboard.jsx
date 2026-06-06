import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts'
import { Shield, AlertTriangle, Activity, Database } from 'lucide-react'
import api from '../services/api'
import ExportReport from '../components/ExportReport'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/analytics/dashboard')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const mockStats = {
    totalScans: 24, totalFindings: 187,
    bySeverity: [{ severity: 'CRITICAL', count: 12 }, { severity: 'HIGH', count: 45 }, { severity: 'MEDIUM', count: 89 }, { severity: 'LOW', count: 41 }],
    byProvider: [{ provider: 'aws', count: 98 }, { provider: 'azure', count: 54 }, { provider: 'gcp', count: 35 }],
    trend: Array.from({ length: 7 }, (_, i) => ({ date: `Apr ${21 + i}`, avg_score: Math.random() * 40 + 30 })),
  }

  const data = stats || mockStats
  const severityColor = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e' }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>{stats ? 'Live data from your scans' : 'Showing sample data — run a scan to populate'}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Dashboard</h1>
        <ExportReport provider="all" />
        </div>
        
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Scans',    value: data.totalScans,    icon: Activity, color: '#3b82f6' },
            { label: 'Total Findings', value: data.totalFindings, icon: AlertTriangle, color: '#f97316' },
            { label: 'Critical',       value: data.bySeverity.find(s => s.severity === 'CRITICAL')?.count || 0, icon: Shield, color: '#ef4444' },
            { label: 'Providers',      value: data.byProvider.length, icon: Database, color: '#22c55e' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</span>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 20 }}>Findings by Severity</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.bySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="severity" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 20 }}>Risk Score Trend (30 days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                <Line type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}