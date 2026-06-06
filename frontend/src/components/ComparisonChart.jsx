import React, { useEffect, useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { getComparison } from '../services/api';

const PROVIDER_COLORS = { aws: '#ff9900', azure: '#0078d4', gcp: '#4285f4' };

export default function ComparisonChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComparison().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>Loading comparison data...</div>;
  if (!data.length) return <div style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>No scan data yet. Run scans on all three providers first.</div>;

  const radarData = [
    { metric: 'Critical', ...Object.fromEntries(data.map(d => [d.provider, +d.total_critical || 0])) },
    { metric: 'High',     ...Object.fromEntries(data.map(d => [d.provider, +d.total_high || 0])) },
    { metric: 'Medium',   ...Object.fromEntries(data.map(d => [d.provider, +d.total_medium || 0])) },
    { metric: 'Avg Risk', ...Object.fromEntries(data.map(d => [d.provider, Math.round(+d.avg_risk_score || 0)])) },
    { metric: 'Scans',    ...Object.fromEntries(data.map(d => [d.provider, +d.total_scans || 0])) },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.95rem' }}>Provider Risk Radar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#5a7490', fontSize: 11 }} />
            {data.map(d => (
              <Radar key={d.provider} name={d.provider.toUpperCase()}
                dataKey={d.provider} stroke={PROVIDER_COLORS[d.provider]}
                fill={PROVIDER_COLORS[d.provider]} fillOpacity={0.15} strokeWidth={2}
              />
            ))}
            <Legend />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.95rem' }}>Avg Risk Score by Provider</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis dataKey="provider" tick={{ fill: '#5a7490', fontSize: 12, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} tickFormatter={v => v.toUpperCase()} />
            <YAxis tick={{ fill: '#5a7490', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="avg_risk_score" radius={[8,8,0,0]} name="Avg Risk Score">
              {data.map(d => <Cell key={d.provider} fill={PROVIDER_COLORS[d.provider]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}