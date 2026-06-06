const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'cloudguard_db',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'cloudguard',
  user:     process.env.DB_USER     || 'cloudguard',
  password: process.env.DB_PASSWORD || 'cloudguard123',
});

const saveScan = async (provider, findings) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const scanRes = await client.query(
      `INSERT INTO scans (provider, total_findings, critical_count, high_count, medium_count, low_count, avg_risk_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        provider,
        findings.length,
        findings.filter(f => f.severity === 'CRITICAL').length,
        findings.filter(f => f.severity === 'HIGH').length,
        findings.filter(f => f.severity === 'MEDIUM').length,
        findings.filter(f => f.severity === 'LOW').length,
        findings.reduce((sum, f) => sum + (f.riskScore || 0), 0) / (findings.length || 1),
      ]
    );
    const scanId = scanRes.rows[0].id;

    for (const f of findings) {
      await client.query(
        `INSERT INTO findings (scan_id, provider, service, check_type, severity, resource_id, description, risk_score, risk_label, recommendations)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [scanId, provider, f.service, f.checkType || f.check_type, f.severity, f.resourceId || f.resource_id || '', f.description, f.riskScore || 50, f.riskLabel || 'MEDIUM', JSON.stringify(f.recommendations || [])]
      );
    }
    await client.query('COMMIT');
    return scanId;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DB save error:', err.message);
  } finally {
    client.release();
  }
};

const getDashboardStats = async () => {
  try {
    const totalScans   = await pool.query('SELECT COUNT(*) FROM scans');
    const totalFindings= await pool.query('SELECT COUNT(*) FROM findings');
    const bySeverity   = await pool.query('SELECT severity, COUNT(*) as count FROM findings GROUP BY severity');
    const byProvider   = await pool.query('SELECT provider, COUNT(*) as count FROM findings GROUP BY provider');
    const recentScans  = await pool.query('SELECT * FROM scans ORDER BY created_at DESC LIMIT 10');
    const trend        = await pool.query(`
      SELECT DATE(created_at) as date, AVG(avg_risk_score) as avg_score
      FROM scans WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date
    `);
    return {
      totalScans:    parseInt(totalScans.rows[0].count),
      totalFindings: parseInt(totalFindings.rows[0].count),
      bySeverity:    bySeverity.rows,
      byProvider:    byProvider.rows,
      recentScans:   recentScans.rows,
      trend:         trend.rows,
    };
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    return { totalScans: 0, totalFindings: 0, bySeverity: [], byProvider: [], recentScans: [], trend: [] };
  }
};

const getComparisonData = async () => {
  try {
    const rows = await pool.query(`
      SELECT provider,
        AVG(avg_risk_score) as avg_risk,
        SUM(critical_count) as critical,
        SUM(high_count) as high,
        SUM(medium_count) as medium,
        SUM(low_count) as low
      FROM scans GROUP BY provider
    `);
    return rows.rows;
  } catch (err) {
    return [];
  }
};

const getTrendData = async () => {
  try {
    const rows = await pool.query(`
      SELECT DATE(created_at) as date, provider, AVG(avg_risk_score) as score
      FROM scans WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at), provider ORDER BY date
    `);
    return rows.rows;
  } catch (err) {
    return [];
  }
};

const getAlerts = async () => {
  try {
    const rows = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50');
    return rows.rows;
  } catch (err) { return []; }
};

const getAlertRules = async () => {
  try {
    const rows = await pool.query('SELECT * FROM alert_rules ORDER BY created_at DESC');
    return rows.rows;
  } catch (err) { return []; }
};

const createAlertRule = async (rule) => {
  const res = await pool.query(
    'INSERT INTO alert_rules (name, provider, severity, email) VALUES ($1,$2,$3,$4) RETURNING *',
    [rule.name, rule.provider, rule.severity, rule.email]
  );
  return res.rows[0];
};

const deleteAlertRule = async (id) => {
  await pool.query('DELETE FROM alert_rules WHERE id=$1', [id]);
};

module.exports = { saveScan, getDashboardStats, getComparisonData, getTrendData, getAlerts, getAlertRules, createAlertRule, deleteAlertRule };