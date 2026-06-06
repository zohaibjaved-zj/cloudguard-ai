import React from 'react'
import { Shield, Brain, Database, Globe } from 'lucide-react'

const stack = [
  { icon: Globe,    label: 'Frontend',   tech: 'React 18 + Vite + Recharts',        color: '#3b82f6' },
  { icon: Shield,   label: 'Backend',    tech: 'Node.js + Express + JWT',            color: '#f97316' },
  { icon: Brain,    label: 'ML Engine',  tech: 'Python FastAPI + Gradient Boosting', color: '#a855f7' },
  { icon: Database, label: 'Database',   tech: 'PostgreSQL 16',                      color: '#22c55e' },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <Shield size={56} color="#3b82f6" style={{ marginBottom: 16 }} />
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>About CloudGuard AI</h1>
        <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
          A semester research project by Muhammad Zohaib and Afifa Yaseen comparing security misconfiguration patterns across AWS, Azure, and GCP.
          Features AI-powered risk scoring using Gradient Boosting trained on 5,000 synthetic scan records.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 48 }}>
          {stack.map(({ icon: Icon, label, tech, color }) => (
            <div key={label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 28, textAlign: 'left' }}>
              <Icon size={28} color={color} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, color: '#f1f5f9', fontWeight: 700 }}>{tech}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 28, textAlign: 'left' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 16 }}>Research Scope</h3>
          {['AWS IAM, S3, EC2 security scanning', 'Azure Storage, NSG misconfiguration detection',
            'GCP Cloud Storage IAM analysis', 'CIS Benchmark + NIST 800-53 + SOC2 compliance mapping',
            'ML risk scoring with feature contributions', 'Cross-provider risk comparison'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', fontSize: 15 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}