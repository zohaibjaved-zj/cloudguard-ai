const router = require('express').Router();
const awsScanner = require('../services/awsScanner');
const mlClient = require('../ml/mlClient');
const dbService = require('../services/dbService');

router.post('/scan', async (req, res) => {
  const { accessKeyId, secretAccessKey, region } = req.body;
  if (!accessKeyId || !secretAccessKey || !region) {
    return res.status(400).json({
      error: 'Missing required AWS credentials',
      required: ['accessKeyId', 'secretAccessKey', 'region']
    });
  }
  try {
    const findings = await awsScanner.scan({ accessKeyId, secretAccessKey, region });
    const enriched = await Promise.all(findings.map(async (f) => {
      try { return { ...f, ...(await mlClient.predict(f)) }; }
      catch { return { ...f, riskScore: 50, riskLabel: 'MEDIUM', confidence: 0.5 }; }
    }));
    await dbService.saveScan('aws', enriched);
    res.json({ provider: 'aws', findings: enriched, total: enriched.length });
  } catch (err) {
    console.error('AWS scan error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;