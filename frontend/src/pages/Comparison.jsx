import React, { useEffect, useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../services/api'

export default function Comparison() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/analytics/comparison').then(r => setData(r.data)).catch(() => {})
  }, [])

  const mockRadar = [
    { subject: 'IAM',     aws: 72, azure: 55, gcp: 61 },
    { subject: 'Storage', aws: 85, azure: 70, gcp: 58 },
    { subject: 'Network', aws: 60, azure: 80, gcp: 65 },
    { subject: 'Encrypt', aws: 55, azure: 65, gcp: 70 },
    { subject: 'Logging', aws: 45, azure: 60, gcp: 55 },
  ]

  const mockBar = [
    { provider: 'AWS',   critical: 12, high: 28, medium: 41, low: 17 },
    { provider: 'Azure', critical: 8,  high: 19, medium: 32, low: 12 },
    { provider: 'GCP',   critical: 5,  high: 14, medium: 28, low: 9  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Provider Comparison</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Cross-provider security risk analysis</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 20 }}>Risk Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mockRadar}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar name="AWS"   dataKey="aws"   stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
                <Radar name="Azure" dataKey="azure" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Radar name="GCP"   dataKey="gcp"   stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 20 }}>Findings by Provider</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="provider" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="critical" fill="#ef4444" stackId="a" />
                <Bar dataKey="high"     fill="#f97316" stackId="a" />
                <Bar dataKey="medium"   fill="#eab308" stackId="a" />
                <Bar dataKey="low"      fill="#22c55e" stackId="a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}