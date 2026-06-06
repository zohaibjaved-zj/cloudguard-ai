import React, { useState } from 'react'
import api from '../services/api'

const REMEDIATION = {
  public_access: {
    title: 'Disable S3 Public Access',
    steps: [
      'Go to AWS Console → S3 → Select bucket → Permissions tab',
      'Click "Edit" under Block Public Access settings',
      'Enable all four Block Public Access options',
      'Save changes and confirm',
      'Run: aws s3api put-public-access-block --bucket BUCKET_NAME --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
    ],
    cis: 'CIS 2.1.1', nist: 'AC-3', soc2: 'CC6.1', priority: 'IMMEDIATE',
  },
  encryption: {
    title: 'Enable S3 Server-Side Encryption',
    steps: [
      'Go to AWS Console → S3 → Select bucket → Properties tab',
      'Click "Edit" under Default encryption',
      'Select SSE-S3 (AES-256) or SSE-KMS for stronger control',
      'Save changes',
      'Run: aws s3api put-bucket-encryption --bucket BUCKET_NAME --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}\'',
    ],
    cis: 'CIS 2.1.3', nist: 'SC-28', soc2: 'CC6.7', priority: 'HIGH',
  },
  versioning: {
    title: 'Enable S3 Bucket Versioning',
    steps: [
      'Go to AWS Console → S3 → Select bucket → Properties tab',
      'Click "Edit" under Bucket Versioning',
      'Select "Enable" and save',
      'Run: aws s3api put-bucket-versioning --bucket BUCKET_NAME --versioning-configuration Status=Enabled',
      'Consider enabling MFA Delete for additional protection',
    ],
    cis: 'CIS 2.1.4', nist: 'CP-9', soc2: 'A1.2', priority: 'MEDIUM',
  },
  password_policy: {
    title: 'Harden IAM Password Policy',
    steps: [
      'Go to AWS Console → IAM → Account Settings',
      'Set minimum password length to 14 characters',
      'Require uppercase, lowercase, numbers, and symbols',
      'Enable password expiration (90 days max)',
      'Prevent password reuse (last 24 passwords)',
      'Run: aws iam update-account-password-policy --minimum-password-length 14 --require-symbols --require-numbers --require-uppercase-characters --require-lowercase-characters --allow-users-to-change-password --max-password-age 90 --password-reuse-prevention 24',
    ],
    cis: 'CIS 1.8', nist: 'IA-5', soc2: 'CC6.1', priority: 'HIGH',
  },
  access_key_rotation: {
    title: 'Rotate IAM Access Keys',
    steps: [
      'Go to AWS Console → IAM → Users → Select user → Security credentials',
      'Create a new access key',
      'Update all applications/services using the old key',
      'Deactivate the old key and verify nothing breaks',
      'Delete the old key after 24-48 hours',
      'Set up AWS Config rule: access-keys-rotated with max age of 90 days',
    ],
    cis: 'CIS 1.14', nist: 'IA-5', soc2: 'CC6.1', priority: 'HIGH',
  },
  open_security_group: {
    title: 'Restrict EC2 Security Group Rules',
    steps: [
      'Go to AWS Console → EC2 → Security Groups → Select group',
      'Edit inbound rules',
      'Replace 0.0.0.0/0 with your specific IP range or VPC CIDR',
      'For SSH (22): use a bastion host or AWS Systems Manager Session Manager instead',
      'For RDP (3389): use AWS Workspaces or VPN',
      'Enable VPC Flow Logs to monitor traffic: aws ec2 create-flow-logs --resource-type VPC --traffic-type ALL',
    ],
    cis: 'CIS 5.2', nist: 'SC-7', soc2: 'CC6.6', priority: 'IMMEDIATE',
  },
  https_enforcement: {
    title: 'Enforce HTTPS on Azure Storage',
    steps: [
      'Go to Azure Portal → Storage accounts → Select account → Configuration',
      'Set "Secure transfer required" to Enabled',
      'Save changes',
      'Run: az storage account update --name ACCOUNT_NAME --resource-group RG_NAME --https-only true',
      'Update all application connection strings to use HTTPS endpoints',
    ],
    cis: 'CIS 3.1', nist: 'SC-8', soc2: 'CC6.7', priority: 'HIGH',
  },
  public_blob_access: {
    title: 'Disable Azure Blob Public Access',
    steps: [
      'Go to Azure Portal → Storage accounts → Select account → Configuration',
      'Set "Allow Blob public access" to Disabled',
      'Save changes',
      'Run: az storage account update --name ACCOUNT_NAME --resource-group RG_NAME --allow-blob-public-access false',
      'Review all containers and remove any anonymous access policies',
    ],
    cis: 'CIS 3.5', nist: 'AC-3', soc2: 'CC6.1', priority: 'IMMEDIATE',
  },
  nsg_permissive: {
    title: 'Restrict Azure NSG Rules',
    steps: [
      'Go to Azure Portal → Network Security Groups → Select NSG → Inbound rules',
      'Remove or restrict rules with Source: Any and Destination Port: *',
      'Apply principle of least privilege — only allow required ports',
      'Run: az network nsg rule update --name RULE_NAME --nsg-name NSG_NAME --resource-group RG_NAME --source-address-prefixes YOUR_IP',
      'Enable NSG Flow Logs for audit trail',
      'Use Azure Firewall or Application Gateway for additional protection',
    ],
    cis: 'CIS 6.1', nist: 'SC-7', soc2: 'CC6.6', priority: 'HIGH',
  },
  tls_version: {
    title: 'Enforce TLS 1.2+ on Azure Storage',
    steps: [
      'Go to Azure Portal → Storage accounts → Select account → Configuration',
      'Set Minimum TLS version to TLS 1.2',
      'Save changes',
      'Run: az storage account update --name ACCOUNT_NAME --resource-group RG_NAME --min-tls-version TLS1_2',
      'Test all client connections to ensure TLS 1.2 compatibility',
    ],
    cis: 'CIS 3.7', nist: 'SC-8', soc2: 'CC6.7', priority: 'MEDIUM',
  },
  public_iam: {
    title: 'Remove GCS Public IAM Bindings',
    steps: [
      'Run: gsutil iam get gs://BUCKET_NAME to view current policy',
      'Remove allUsers and allAuthenticatedUsers bindings:',
      'gsutil iam ch -d allUsers gs://BUCKET_NAME',
      'gsutil iam ch -d allAuthenticatedUsers gs://BUCKET_NAME',
      'Enable uniform bucket-level access to prevent ACL overrides',
      'Set up Cloud Audit Logs to track IAM changes',
    ],
    cis: 'CIS 5.1', nist: 'AC-3', soc2: 'CC6.1', priority: 'IMMEDIATE',
  },
  uniform_access: {
    title: 'Enable GCS Uniform Bucket-Level Access',
    steps: [
      'Run: gsutil uniformbucketlevelaccess set on gs://BUCKET_NAME',
      'Or via Console: Cloud Storage → Select bucket → Permissions → Access control → Uniform',
      'Review and migrate any object-level ACLs before enabling',
      'Verify with: gsutil uniformbucketlevelaccess get gs://BUCKET_NAME',
    ],
    cis: 'CIS 5.2', nist: 'AC-6', soc2: 'CC6.3', priority: 'MEDIUM',
  },
}

// ── Smart check_type resolver ──
const resolveCheckType = (finding) => {
  if (finding.check_type && REMEDIATION[finding.check_type]) return finding.check_type
  const desc = (finding.description || '').toLowerCase()
  if (desc.includes('public blob') || desc.includes('blob public'))                          return 'public_blob_access'
  if (desc.includes('https') || desc.includes('secure transfer'))                            return 'https_enforcement'
  if (desc.includes('tls') || desc.includes('minimum tls'))                                  return 'tls_version'
  if (desc.includes('nsg') || desc.includes('inbound') || desc.includes('network security')) return 'nsg_permissive'
  if (desc.includes('public access') && desc.includes('s3'))                                 return 'public_access'
  if (desc.includes('encryption') || desc.includes('server-side'))                           return 'encryption'
  if (desc.includes('versioning'))                                                            return 'versioning'
  if (desc.includes('password policy') || desc.includes('mfa'))                              return 'password_policy'
  if (desc.includes('access key') || desc.includes('rotation'))                              return 'access_key_rotation'
  if (desc.includes('security group') || desc.includes('ssh') || desc.includes('0.0.0.0'))  return 'open_security_group'
  if (desc.includes('allusers') || desc.includes('public iam'))                              return 'public_iam'
  if (desc.includes('uniform') || desc.includes('bucket-level'))                             return 'uniform_access'
  return null
}

// ── Generate HTML report string ──
const generateHTML = (findings, provider, generatedAt) => {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  findings.forEach(f => { if (counts[f.severity] !== undefined) counts[f.severity]++ })
  const overallRisk = findings.length === 0 ? 0 :
    Math.round(findings.reduce((s, f) => s + (f.risk_score || 50), 0) / findings.length)

  // ── Use resolveCheckType for every finding ──
  const resolvedFindings = findings.map(f => ({ ...f, _resolvedType: resolveCheckType(f) }))
  const uniqueTypes = [...new Set(resolvedFindings.map(f => f._resolvedType).filter(Boolean))]

  const remediationSections = uniqueTypes.map(ct => {
    const rem = REMEDIATION[ct]
    if (!rem) return ''
    const relatedFindings = resolvedFindings.filter(f => f._resolvedType === ct)
    return `
      <div class="remediation-card priority-${rem.priority.toLowerCase()}">
        <div class="rem-header">
          <div>
            <span class="priority-badge priority-${rem.priority.toLowerCase()}">${rem.priority}</span>
            <h3>${rem.title}</h3>
          </div>
          <div class="compliance-tags">
            <span class="tag">${rem.cis}</span>
            <span class="tag">${rem.nist}</span>
            <span class="tag">${rem.soc2}</span>
          </div>
        </div>
        <p class="affected">Affects ${relatedFindings.length} resource(s): ${relatedFindings.map(f => f.resource_id || f.resourceId || 'N/A').join(', ')}</p>
        <ol class="steps">
          ${rem.steps.map(s => `<li><code>${s}</code></li>`).join('')}
        </ol>
      </div>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CloudGuard AI — Security Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; }
  .page { max-width: 960px; margin: 0 auto; padding: 40px; }

  .report-header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: white; padding: 40px; border-radius: 16px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; }
  .report-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 6px; }
  .report-header .subtitle { color: #93c5fd; font-size: 14px; }
  .report-header .meta { text-align: right; font-size: 13px; color: #94a3b8; }
  .logo { font-size: 24px; font-weight: 900; color: #3b82f6; }

  .risk-overview { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .risk-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .risk-card .value { font-size: 40px; font-weight: 900; line-height: 1; }
  .risk-card .label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin-top: 6px; text-transform: uppercase; }
  .critical .value { color: #ef4444; }
  .high .value    { color: #f97316; }
  .medium .value  { color: #eab308; }
  .low .value     { color: #22c55e; }
  .overall .value { color: #3b82f6; }

  .section-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }

  table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 32px; font-size: 13px; }
  th { background: #0f172a; color: #94a3b8; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
  .sev-badge { display: inline-block; padding: 2px 10px; border-radius: 5px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
  .sev-CRITICAL { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; }
  .sev-HIGH     { background: #fff7ed; color: #f97316; border: 1px solid #fed7aa; }
  .sev-MEDIUM   { background: #fefce8; color: #ca8a04; border: 1px solid #fde68a; }
  .sev-LOW      { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .provider-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #f1f5f9; color: #475569; }
  .score { font-weight: 800; font-size: 16px; color: #3b82f6; }

  .remediation-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 4px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .priority-immediate { border-left-color: #ef4444; }
  .priority-high      { border-left-color: #f97316; }
  .priority-medium    { border-left-color: #eab308; }
  .priority-low       { border-left-color: #22c55e; }
  .rem-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
  .rem-header h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 6px; }
  .priority-badge { display: inline-block; padding: 2px 10px; border-radius: 5px; font-size: 10px; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px; }
  .priority-badge.priority-immediate { background: #fef2f2; color: #ef4444; }
  .priority-badge.priority-high      { background: #fff7ed; color: #f97316; }
  .priority-badge.priority-medium    { background: #fefce8; color: #ca8a04; }
  .priority-badge.priority-low       { background: #f0fdf4; color: #16a34a; }
  .compliance-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .affected { color: #64748b; font-size: 13px; margin-bottom: 14px; }
  .steps { padding-left: 20px; }
  .steps li { margin-bottom: 8px; font-size: 13px; color: #374151; line-height: 1.5; }
  .steps li code { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 2px 6px; font-family: 'Courier New', monospace; font-size: 12px; color: #0f172a; word-break: break-all; }

  .report-footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px; }

  @media print {
    body { background: white; }
    .page { padding: 20px; }
    .remediation-card { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="report-header">
    <div>
      <div class="logo">🛡 CloudGuard AI</div>
      <h1>Security Assessment Report</h1>
      <div class="subtitle">Provider: ${provider.toUpperCase()} &nbsp;|&nbsp; Cloud Misconfiguration Analysis</div>
    </div>
    <div class="meta">
      <div style="font-size:11px;margin-bottom:4px">GENERATED</div>
      <div style="font-size:15px;font-weight:700;color:white">${new Date(generatedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
      <div style="margin-top:4px">${new Date(generatedAt).toLocaleTimeString()}</div>
    </div>
  </div>

  <div class="risk-overview">
    <div class="risk-card overall"><div class="value">${overallRisk}</div><div class="label">Avg Risk Score</div></div>
    <div class="risk-card critical"><div class="value">${counts.CRITICAL}</div><div class="label">Critical</div></div>
    <div class="risk-card high"><div class="value">${counts.HIGH}</div><div class="label">High</div></div>
    <div class="risk-card medium"><div class="value">${counts.MEDIUM}</div><div class="label">Medium</div></div>
    <div class="risk-card low"><div class="value">${counts.LOW}</div><div class="label">Low</div></div>
  </div>

  <div class="section-title">📋 All Findings (${findings.length})</div>
  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Provider</th>
        <th>Service</th>
        <th>Check</th>
        <th>Resource</th>
        <th>Description</th>
        <th>Risk Score</th>
      </tr>
    </thead>
    <tbody>
      ${resolvedFindings.map(f => `
        <tr>
          <td><span class="sev-badge sev-${f.severity}">${f.severity}</span></td>
          <td><span class="provider-badge">${(f.provider || '').toUpperCase()}</span></td>
          <td>${f.service || '—'}</td>
          <td>${f._resolvedType || f.check_type || '—'}</td>
          <td style="font-family:monospace;font-size:12px">${f.resource_id || f.resourceId || '—'}</td>
          <td>${f.description || '—'}</td>
          <td class="score">${f.risk_score ? Math.round(f.risk_score) : '—'}</td>
        </tr>`).join('')}
    </tbody>
  </table>

  <div class="section-title">🔧 Remediation Guide & Security Fixes</div>
  ${remediationSections || '<p style="color:#64748b;padding:16px">No specific remediation steps found for current findings.</p>'}

  <div class="report-footer">
    <p>CloudGuard AI — Cloud Misconfiguration Detection Platform &nbsp;|&nbsp; Generated ${new Date(generatedAt).toISOString()}</p>
    <p style="margin-top:4px">This report contains ${findings.length} findings across ${[...new Set(findings.map(f => f.provider))].join(', ').toUpperCase() || provider.toUpperCase()}</p>
  </div>

</div>
</body>
</html>`
}

// ── Generate CSV ──
const generateCSV = (findings) => {
  const resolvedFindings = findings.map(f => ({ ...f, _resolvedType: resolveCheckType(f) }))
  const headers = ['Severity','Provider','Service','Check Type','Resource ID','Description','Risk Score','Risk Label','CIS Control','NIST Control','SOC2 Control']
  const rows = resolvedFindings.map(f => {
    const rem = REMEDIATION[f._resolvedType] || REMEDIATION[f.check_type] || {}
    return [
      f.severity,
      f.provider,
      f.service,
      f._resolvedType || f.check_type || '',
      f.resource_id || f.resourceId || '',
      `"${(f.description || '').replace(/"/g, '""')}"`,
      f.risk_score ? Math.round(f.risk_score) : '',
      f.risk_label || '',
      rem.cis  || '',
      rem.nist || '',
      rem.soc2 || '',
    ].join(',')
  })
  return [headers.join(','), ...rows].join('\n')
}

// ── Main Component ──
export default function ExportReport({ findings = [], provider = 'all', scanData = null }) {
  const [loading, setLoading] = useState(false)
  const [format, setFormat]   = useState('pdf')
  const [open, setOpen]       = useState(false)

  const usedFindings = findings.length > 0 ? findings : []

  const fetchAndExport = async (fmt) => {
    setLoading(true)
    try {
      let data = usedFindings
      let generatedAt = new Date().toISOString()

      if (data.length === 0) {
        try {
          const res = await api.get(`/api/analytics/report/${provider}`)
          data = res.data.findings || []
          generatedAt = res.data.generated
        } catch {}
      }

      if (fmt === 'pdf' || fmt === 'html') {
        const html = generateHTML(data, provider, generatedAt)
        const blob = new Blob([html], { type: 'text/html' })
        const url  = URL.createObjectURL(blob)

        if (fmt === 'html') {
          const a = document.createElement('a')
          a.href = url
          a.download = `cloudguard-report-${provider}-${Date.now()}.html`
          a.click()
          URL.revokeObjectURL(url)
        } else {
          const win = window.open(url, '_blank')
          setTimeout(() => { win?.print() }, 800)
        }
      }

      if (fmt === 'csv') {
        const csv  = generateCSV(data)
        const blob = new Blob([csv], { type: 'text/csv' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href = url
        a.download = `cloudguard-findings-${provider}-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }

      if (fmt === 'json') {
        const resolved = data.map(f => ({ ...f, _resolvedType: resolveCheckType(f) }))
        const blob = new Blob(
          [JSON.stringify({ provider, generatedAt, findings: resolved }, null, 2)],
          { type: 'application/json' }
        )
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href = url
        a.download = `cloudguard-findings-${provider}-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      }

      setOpen(false)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const formats = [
    { id: 'pdf',  label: 'PDF Report',  icon: '📄', desc: 'Print-ready full report with remediation guide' },
    { id: 'html', label: 'HTML Report', icon: '🌐', desc: 'Standalone HTML file, shareable and offline-ready' },
    { id: 'csv',  label: 'CSV Export',  icon: '📊', desc: 'Spreadsheet-compatible findings data' },
    { id: 'json', label: 'JSON Export', icon: '🔧', desc: 'Raw data for integration with other tools' },
  ]

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#059669', color: '#fff', border: 'none',
        padding: '10px 20px', borderRadius: 10,
        fontWeight: 700, fontSize: 14, cursor: 'pointer',
      }}>
        ⬇ Export Report
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, margin: 0 }}>Export Security Report</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              Report includes all findings, AI risk scores, compliance mappings (CIS/NIST/SOC2), and step-by-step remediation guides.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {formats.map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  background: format === f.id ? '#1e3a5f' : '#030712',
                  border: `1px solid ${format === f.id ? '#1d4ed8' : '#1e293b'}`,
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <div>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>{f.label}</div>
                    <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>{f.desc}</div>
                  </div>
                  {format === f.id && <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: 18 }}>✓</span>}
                </button>
              ))}
            </div>

            <button onClick={() => fetchAndExport(format)} disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? '#1e293b' : '#059669',
              color: loading ? '#475569' : '#fff',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? '⏳ Generating...' : `⬇ Download ${formats.find(f => f.id === format)?.label}`}
            </button>
          </div>
        </div>
      )}
    </>
  )
}