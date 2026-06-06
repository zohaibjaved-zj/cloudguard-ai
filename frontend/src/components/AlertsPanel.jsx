import React, { useState } from 'react';
import { Bell, Plus, Shield } from 'lucide-react';
import { createAlertRule } from '../services/api';

const SEVERITIES = ['CRITICAL','HIGH','MEDIUM','LOW'];
const PROVIDERS = ['aws','azure','gcp'];

export default function AlertsPanel({ token }) {
  const [form, setForm] = useState({ name: '', provider: '', severityThreshold: 'HIGH', serviceFilter: '', emailNotify: true });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!token) return setError('Login required to save alert rules.');
    try {
      await createAlertRule(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setError('');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save rule');
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Bell size={18} color="var(--accent)" /> Create Alert Rule
      </h3>

      <div style={{ display: 'grid', gap: '0.875rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rule Name</label>
          <input placeholder="e.g. Critical AWS Alerts" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Provider</label>
            <select value={form.provider} onChange={e => set('provider', e.target.value)}>
              <option value="">All Providers</option>
              {PROVIDERS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Severity</label>
            <select value={form.severityThreshold} onChange={e => set('severityThreshold', e.target.value)}>
              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Service Filter (optional)</label>
          <input placeholder="e.g. IAM, S3, EC2" value={form.serviceFilter} onChange={e => set('serviceFilter', e.target.value)} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={form.emailNotify} onChange={e => set('emailNotify', e.target.checked)} style={{ width: 'auto', cursor: 'pointer' }} />
          Send email notifications
        </label>
      </div>

      {error && <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>⚠ {error}</div>}

      <button onClick={handleSave} style={{
        marginTop: '1rem', width: '100%', padding: '0.75rem',
        background: saved ? 'rgba(0,230,118,0.15)' : 'rgba(0,229,255,0.1)',
        border: `1px solid ${saved ? 'rgba(0,230,118,0.3)' : 'rgba(0,229,255,0.2)'}`,
        color: saved ? '#00e676' : 'var(--accent)',
        borderRadius: 8, fontWeight: 700, fontSize: '0.9rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', transition: 'all 0.2s',
      }}>
        {saved ? '✅ Rule Saved!' : <><Plus size={15} /> Save Alert Rule</>}
      </button>
    </div>
  );
}