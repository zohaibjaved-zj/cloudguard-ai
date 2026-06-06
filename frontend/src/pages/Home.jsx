import React, { useState } from 'react'
import { Shield, Cloud, Zap, Lock, ChevronRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ExportReport from '../components/ExportReport'

const providers = [
  { id: 'aws',   label: 'Amazon Web Services', color: '#f97316', fields: [
    { key: 'accessKeyId',     label: 'Access Key ID',     placeholder: 'AKIAIOSFODNN7EXAMPLE' },
    { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: '••••••••••••••••••••', type: 'password' },
    { key: 'region',          label: 'Region',            placeholder: 'us-east-1' },
  ]},
  { id: 'azure', label: 'Microsoft Azure',     color: '#3b82f6', fields: [
    { key: 'tenantId',       label: 'Tenant ID',       placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    { key: 'clientId',       label: 'Client ID',       placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    { key: 'clientSecret',   label: 'Client Secret',   placeholder: '••••••••••••••••••••', type: 'password' },
    { key: 'subscriptionId', label: 'Subscription ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
  ]},
  { id: 'gcp',   label: 'Google Cloud Platform', color: '#22c55e', fields: [
    { key: 'projectId',   label: 'Project ID',          placeholder: 'my-project-123' },
    { key: 'credentials', label: 'Service Account JSON', placeholder: '{"type":"service_account",...}', type: 'textarea' },
  ]},
]

export default function Home() {
  const [selected, setSelected] = useState('aws')
  const [form, setForm]         = useState({})
  const [loading, setLoading]   = useState(false)
  const [results, setResults]   = useState(null)
  const [error, setError]       = useState(null)

  const provider = providers.find(p => p.id === selected)

  const handleScan = async () => {
    setLoading(true); setError(null); setResults(null)
    try {
      const res = await api.post(`/api/${selected}/scan`, form)
      setResults(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const severityColor = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e' }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1e3a5f', border: '1px solid #1d4ed8', borderRadius: 20, padding: '4px 16px', marginBottom: 16 }}>
            <Zap size={14} color="#60a5fa" />
            <span style={{ fontSize: 13, color: '#93c5fd' }}>AI-Powered Risk Scoring</span>
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginBottom: 16 }}>
            Detect Cloud <span style={{ color: '#3b82f6' }}>Misconfigurations</span>
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            Scan AWS, Azure, and GCP for security risks. Get AI-powered risk scores and compliance mappings instantly.
          </p>
        </div>

        {/* Provider Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
          {providers.map(p => (
            <button key={p.id} onClick={() => { setSelected(p.id); setForm({}); setResults(null) }} style={{
              padding: '10px 28px', borderRadius: 10, border: `2px solid ${selected === p.id ? p.color : '#1e293b'}`,
              background: selected === p.id ? `${p.color}22` : '#0f172a',
              color: selected === p.id ? p.color : '#64748b',
              fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s'
            }}>{p.label}</button>
          ))}
        </div>

        {/* Scan Form */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: provider.id === 'gcp' ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            {provider.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea rows={4} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 13, resize: 'vertical', fontFamily: 'monospace' }} />
                ) : (
                  <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14 }} />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleScan} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: loading ? '#1e3a5f' : '#2563eb', color: '#fff',
            fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {loading ? '🔍 Scanning...' : <><Shield size={18} /> Run Security Scan</>}
          </button>
          {error && <div style={{ marginTop: 16, padding: 12, background: '#450a0a', border: '1px solid #991b1b', borderRadius: 8, color: '#fca5a5', fontSize: 14 }}>❌ {error}</div>}
        </div>

        {/* Results */}
        {results && (
          <div>
          {/* Export Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 20, margin: 0 }}>
              {results.total} Findings — {selected.toUpperCase()}
          </h2>
          <ExportReport findings={results.findings} provider={selected} />
          </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.findings.map((f, i) => (
                <div key={i} style={{ background: '#0f172a', border: `1px solid ${severityColor[f.severity] || '#334155'}44`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: `${severityColor[f.severity]}22`, color: severityColor[f.severity], padding: '2px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{f.severity}</span>
                      <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>{f.service} — {f.checkType || f.check_type}</span>
                    </div>
                    <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: 18 }}>{f.riskScore?.toFixed(0) ?? '—'}</span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 6 }}>{f.description}</p>
                  <p style={{ color: '#475569', fontSize: 12 }}>Resource: {f.resourceId || f.resource_id}</p>
                  {f.recommendations?.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      {f.recommendations.map((r, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4 }}>
                          <CheckCircle size={14} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: '#86efac' }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}