import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

const fwColor = { CIS: '#00e5ff', NIST: '#7c3aed', SOC2: '#00e676' };

export default function ComplianceReport({ compliance }) {
  const [activefw, setFw] = useState('CIS');
  const [expanded, setExp] = useState({});

  if (!compliance) return null;
  const report = compliance[activefw];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>📋 Compliance Report</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {['CIS','NIST','SOC2'].map(fw => (
            <button key={fw} onClick={() => setFw(fw)} style={{
              padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.78rem',
              background: activefw === fw ? `${fwColor[fw]}20` : 'var(--surface2)',
              color: activefw === fw ? fwColor[fw] : 'var(--muted)',
              border: `1px solid ${activefw === fw ? fwColor[fw] + '44' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>{fw}</button>
          ))}
        </div>
      </div>

      {/* Score Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{report.passed} / {report.total} controls passed</span>
          <span style={{ fontWeight: 800, color: fwColor[activefw], fontFamily: 'var(--font-mono)' }}>{report.score}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4 }}>
          <div style={{
            height: '100%', width: `${report.score}%`,
            background: `linear-gradient(90deg, ${fwColor[activefw]}, ${fwColor[activefw]}88)`,
            borderRadius: 4, transition: 'width 0.8s ease',
            boxShadow: `0 0 10px ${fwColor[activefw]}44`
          }} />
        </div>
      </div>

      {/* Controls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
        {(report.controls || []).map(ctrl => (
          <div key={ctrl.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem',
            borderRadius: 8, background: ctrl.status === 'FAIL' ? 'rgba(255,59,92,0.06)' : 'rgba(0,230,118,0.04)',
            border: `1px solid ${ctrl.status === 'FAIL' ? 'rgba(255,59,92,0.15)' : 'rgba(0,230,118,0.1)'}`,
          }}>
            {ctrl.status === 'PASS'
              ? <CheckCircle size={15} color="#00e676" />
              : <XCircle size={15} color="#ff3b5c" />
            }
            <code style={{ fontSize: '0.72rem', color: fwColor[activefw], minWidth: 70, fontFamily: 'var(--font-mono)' }}>{ctrl.id}</code>
            <span style={{ fontSize: '0.82rem', flex: 1 }}>{ctrl.title}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', background: 'var(--surface2)', padding: '1px 6px', borderRadius: 3 }}>{ctrl.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}