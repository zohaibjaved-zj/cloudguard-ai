import React from 'react';

const labelColor = { CRITICAL: '#ff3b5c', HIGH: '#ffb800', MEDIUM: '#ff7700', LOW: '#00e676' };

export default function RiskScore({ mlRisk }) {
  if (!mlRisk) return null;
  const { risk_score, risk_label, confidence, recommendations, feature_contributions, fallback } = mlRisk;
  const color = labelColor[risk_label] || '#8fafc9';
  const pct = Math.round(risk_score);

  const radius = 54, circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Circular gauge */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={130} height={130} viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--surface2)" strokeWidth="10" />
            <circle cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth="10"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color}66)` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{pct}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 700 }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>AI Risk Assessment</span>
            {fallback && <span style={{ fontSize: '0.65rem', background: 'rgba(255,184,0,0.15)', color: '#ffb800', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>RULE-BASED</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 12px', borderRadius: 20, fontWeight: 800, fontSize: '0.8rem', background: `${color}22`, color, border: `1px solid ${color}44` }}>
              {risk_label} RISK
            </span>
            <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', background: 'var(--surface2)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {(confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(recommendations || []).slice(0, 3).map((r, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#b8cde0', lineHeight: 1.5 }}>{r}</div>
            ))}
          </div>
        </div>

        {/* Feature contributions */}
        {Object.keys(feature_contributions || {}).length > 0 && (
          <div style={{ minWidth: 180 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>Risk Drivers</div>
            {Object.entries(feature_contributions)
              .sort(([,a],[,b]) => b - a)
              .slice(0, 5)
              .map(([k, v]) => (
                <div key={k} style={{ marginBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 2 }}>
                    <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{k.replace(/_/g,' ')}</span>
                    <span style={{ color }}>{v.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--surface2)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${Math.min(100, v * 10)}%`, background: color, borderRadius: 2, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}