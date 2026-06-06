const router = require('express').Router()
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'cloudguard_db',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'cloudguard',
  user:     process.env.DB_USER     || 'cloudguard',
  password: process.env.DB_PASSWORD || 'cloudguard123',
})

router.get('/dashboard', async (req, res) => {
  try {
    const totalScans    = await pool.query('SELECT COUNT(*) FROM scans')
    const totalFindings = await pool.query('SELECT COUNT(*) FROM findings')
    const bySeverity    = await pool.query('SELECT severity, COUNT(*) as count FROM findings GROUP BY severity')
    const byProvider    = await pool.query('SELECT provider, COUNT(*) as count FROM findings GROUP BY provider')
    const recentScans   = await pool.query('SELECT * FROM scans ORDER BY created_at DESC LIMIT 10')
    const trend         = await pool.query(`
      SELECT DATE(created_at) as date, AVG(avg_risk_score) as avg_score
      FROM scans WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date
    `)
    res.json({
      totalScans:    parseInt(totalScans.rows[0].count),
      totalFindings: parseInt(totalFindings.rows[0].count),
      bySeverity:    bySeverity.rows,
      byProvider:    byProvider.rows,
      recentScans:   recentScans.rows,
      trend:         trend.rows,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/comparison', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT provider,
        AVG(avg_risk_score) as avg_risk,
        SUM(critical_count) as critical,
        SUM(high_count) as high,
        SUM(medium_count) as medium,
        SUM(low_count) as low
      FROM scans GROUP BY provider
    `)
    res.json(rows.rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/trend', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT DATE(created_at) as date, provider, AVG(avg_risk_score) as score
      FROM scans WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at), provider ORDER BY date
    `)
    res.json(rows.rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/report/:provider', async (req, res) => {
  try {
    const { provider } = req.params
    const query = provider === 'all'
      ? `SELECT f.*, s.created_at as scan_date FROM findings f JOIN scans s ON f.scan_id = s.id ORDER BY
         CASE f.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END, s.created_at DESC LIMIT 500`
      : `SELECT f.*, s.created_at as scan_date FROM findings f JOIN scans s ON f.scan_id = s.id WHERE f.provider=$1 ORDER BY
         CASE f.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END, s.created_at DESC LIMIT 500`
    const result = provider === 'all'
      ? await pool.query(query)
      : await pool.query(query, [provider])
    res.json({ findings: result.rows, generated: new Date().toISOString(), provider })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router