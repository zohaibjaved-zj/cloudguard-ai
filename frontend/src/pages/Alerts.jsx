import React, { useState, useEffect } from 'react'
import api from '../services/api'

const SEV_CONFIG = {
  CRITICAL: { bg: '#1a0505', border: '#7f1d1d', badge: '#ef4444', dot: '#ef4444', label: '#fca5a5' },
  HIGH:     { bg: '#1a0c05', border: '#7c2d12', badge: '#f97316', dot: '#f97316', label: '#fdba74' },
  MEDIUM:   { bg: '#1a1505', border: '#713f12', badge: '#eab308', dot: '#eab308', label: '#fde047' },
  LOW:      { bg: '#051a0a', border: '#14532d', badge: '#22c55e', dot: '#22c55e', label: '#86efac' },
}

const ICONS = {
  CRITICAL: '🔴',
  HIGH:     '🟠',
  MEDIUM:   '🟡',
  LOW:      '🟢',
}

const mockAlerts = [
  { id: 1, severity: 'CRITICAL', provider: 'aws',   message: 'S3 bucket "prod-backups" is publicly accessible',        timestamp: new Date(Date.now() - 3600000).toISOString(),  acknowledged: false },
  { id: 2, severity: 'HIGH',     provider: 'azure', message: 'Storage account allows public blob access',               timestamp: new Date(Date.now() - 7200000).toISOString(),  acknowledged: false },
  { id: 3, severity: 'MEDIUM',   provider: 'gcp',   message: 'GCS bucket versioning is disabled on prod-archive',      timestamp: new Date(Date.now() - 14400000).toISOString(), acknowledged: false },
  { id: 4, severity: 'HIGH',     provider: 'aws',   message: 'EC2 security group allows SSH from 0.0.0.0/0',           timestamp: new Date(Date.now() - 86400000).toISOString(), acknowledged: true  },
  { id: 5, severity: 'LOW',      provider: 'azure', message: 'Storage account minimum TLS version below 1.2',          timestamp: new Date(Date.now() - 90000000).toISOString(), acknowledged: true  },
  { id: 6, severity: 'CRITICAL', provider: 'gcp',   message: 'GCS bucket has allUsers in IAM policy — public internet', timestamp: new Date(Date.now() - 172800000).toISOString(),acknowledged: false },
]

export default function Alerts() {
  const [alerts, setAlerts]         = useState([])
  const [rules, setRules]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [filterSev, setFilterSev]   = useState('ALL')
  const [newRule, setNewRule]       = useState({ name: '', provider: 'aws', severity: 'HIGH', email: '' })

  useEffect(() => {
    api.get('/api/alerts')
      .then(r => { setAlerts(r.data.alerts || []); setRules(r.data.rules || []) })
      .catch(() => { setAlerts([]); setRules([]) })
      .finally(() => setLoading(false))
  }, [])

  const displayAlerts = (alerts.length > 0 ? alerts : mockAlerts)
    .filter(a => filterSev === 'ALL' || a.severity === filterSev)

  const counts = ['CRITICAL','HIGH','MEDIUM','LOW'].reduce((acc, s) => {
    acc[s] = (alerts.length > 0 ? alerts : mockAlerts).filter(a => a.severity === s).length
    return acc
  }, {})

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.email) return
    try {
      await api.post('/api/alerts/rules', newRule)
      setShowForm(false)
      setNewRule({ name: '', provider: 'aws', severity: 'HIGH', email: '' })
      const r = await api.get('/api/alerts')
      setRules(r.data.rules || [])
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/alerts/rules/${id}`)
      setRules(rules.filter(r => r.id !== id))
    } catch {}
  }

  const inputStyle = {
    width: '100%', background: '#0f172a', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 14px', color: '#f1f5f9',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#1e3a5f', border: '1px solid #1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔔</div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Alerts</h1>
            </div>
            <p style={{ color: '#475569', fontSize: 14, margin: 0, paddingLeft: 54 }}>Real-time security notifications and alert rules</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#2563eb', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontWeight: 700,
            fontSize: 14, cursor: 'pointer',
          }}>
            ＋ New Rule
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {['CRITICAL','HIGH','MEDIUM','LOW'].map(sev => {
            const cfg = SEV_CONFIG[sev]
            return (
              <div key={sev} onClick={() => setFilterSev(filterSev === sev ? 'ALL' : sev)}
                style={{
                  background: filterSev === sev ? cfg.bg : '#0f172a',
                  border: `1px solid ${filterSev === sev ? cfg.border : '#1e293b'}`,
                  borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
                  transition: 'all 0.15s', textAlign: 'center',
                }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: cfg.badge, lineHeight: 1 }}>{counts[sev]}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: cfg.label, letterSpacing: 1.5, marginTop: 6 }}>{sev}</div>
              </div>
            )
          })}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── Alert Feed ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 18, margin: 0 }}>Recent Alerts</h2>
              {filterSev !== 'ALL' && (
                <button onClick={() => setFilterSev('ALL')} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                  ✕ Clear filter
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>Loading alerts...</div>
            ) : displayAlerts.length === 0 ? (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
                <p style={{ color: '#475569', margin: 0 }}>No alerts for this filter</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {displayAlerts.map(alert => {
                  const cfg = SEV_CONFIG[alert.severity] || SEV_CONFIG.MEDIUM
                  return (
                    <div key={alert.id} style={{
                      background: alert.acknowledged ? '#0a0f1a' : cfg.bg,
                      border: `1px solid ${alert.acknowledged ? '#1e293b' : cfg.border}`,
                      borderRadius: 14, padding: '18px 20px',
                      opacity: alert.acknowledged ? 0.6 : 1,
                      transition: 'all 0.15s',
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                    }}>
                      {/* Left dot */}
                      <div style={{ marginTop: 3, flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: alert.acknowledged ? '#334155' : cfg.dot, boxShadow: alert.acknowledged ? 'none' : `0 0 8px ${cfg.dot}` }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            background: `${cfg.badge}22`, color: cfg.badge,
                            border: `1px solid ${cfg.badge}55`,
                            padding: '2px 10px', borderRadius: 6,
                            fontSize: 11, fontWeight: 800, letterSpacing: 1,
                          }}>{alert.severity}</span>
                          <span style={{
                            background: '#1e293b', color: '#94a3b8',
                            padding: '2px 10px', borderRadius: 6,
                            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                          }}>{alert.provider}</span>
                          {alert.acknowledged && (
                            <span style={{ background: '#1e293b', color: '#475569', padding: '2px 10px', borderRadius: 6, fontSize: 11 }}>✓ Acknowledged</span>
                          )}
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: 14, margin: '0 0 6px', lineHeight: 1.5 }}>{alert.message}</p>
                        <p style={{ color: '#334155', fontSize: 12, margin: 0 }}>
                          🕐 {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Right Panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* New Rule Form */}
            {showForm && (
              <div style={{ background: '#0f172a', border: '1px solid #1d4ed8', borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>Create Alert Rule</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>RULE NAME</label>
                    <input style={inputStyle} placeholder="e.g. Critical AWS Alerts" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>PROVIDER</label>
                    <select style={inputStyle} value={newRule.provider} onChange={e => setNewRule({ ...newRule, provider: e.target.value })}>
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">GCP</option>
                      <option value="all">All Providers</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>MIN SEVERITY</label>
                    <select style={inputStyle} value={newRule.severity} onChange={e => setNewRule({ ...newRule, severity: e.target.value })}>
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>NOTIFY EMAIL</label>
                    <input style={inputStyle} type="email" placeholder="you@example.com" value={newRule.email} onChange={e => setNewRule({ ...newRule, email: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button onClick={handleCreateRule} style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Save Rule</button>
                    <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Rules List */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: '0 0 16px' }}>Alert Rules</h3>
              {rules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                  <p style={{ color: '#334155', fontSize: 13, margin: 0 }}>No rules yet.</p>
                  <p style={{ color: '#1e293b', fontSize: 12, margin: '4px 0 0' }}>Click "New Rule" to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rules.map(rule => {
                    const cfg = SEV_CONFIG[rule.severity] || SEV_CONFIG.MEDIUM
                    return (
                      <div key={rule.id} style={{ background: '#030712', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>{rule.name}</p>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ fontSize: 11, color: '#64748b', background: '#1e293b', padding: '1px 8px', borderRadius: 4 }}>{rule.provider.toUpperCase()}</span>
                            <span style={{ fontSize: 11, color: cfg.badge, background: `${cfg.badge}22`, padding: '1px 8px', borderRadius: 4 }}>{rule.severity}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(rule.id)} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}
                          onMouseEnter={e => e.target.style.color = '#ef4444'} onMouseLeave={e => e.target.style.color = '#334155'}>
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Summary box */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: '0 0 16px' }}>Summary</h3>
              {[
                { label: 'Total Alerts',       value: (alerts.length > 0 ? alerts : mockAlerts).length,                          color: '#3b82f6' },
                { label: 'Unacknowledged',     value: (alerts.length > 0 ? alerts : mockAlerts).filter(a => !a.acknowledged).length, color: '#f97316' },
                { label: 'Active Rules',       value: rules.length,                                                               color: '#22c55e' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #0f172a' }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{label}</span>
                  <span style={{ color, fontWeight: 800, fontSize: 20 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}