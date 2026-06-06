const router = require('express').Router();
const gcpScanner = require('../services/gcpScanner');
const mlClient = require('../ml/mlClient');
const dbService = require('../services/dbService');

router.post('/scan', async (req, res) => {
  const { projectId, credentials } = req.body;
  if (!projectId || !credentials) {
    return res.status(400).json({
      error: 'Missing required GCP credentials',
      required: ['projectId', 'credentials']
    });
  }
  try {
    const findings = await gcpScanner.scan({ projectId, credentials });
    const enriched = await Promise.all(findings.map(async (f) => {
      try { return { ...f, ...(await mlClient.predict(f)) }; }
      catch { return { ...f, riskScore: 50, riskLabel: 'MEDIUM', confidence: 0.5 }; }
    }));
    await dbService.saveScan('gcp', enriched);
    res.json({ provider: 'gcp', findings: enriched, total: enriched.length });
  } catch (err) {
    console.error('GCP scan error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;