const router = require('express').Router();
const azureScanner = require('../services/azureScanner');
const mlClient = require('../ml/mlClient');
const dbService = require('../services/dbService');

router.post('/scan', async (req, res) => {
  const { tenantId, clientId, clientSecret, subscriptionId } = req.body;
  if (!tenantId || !clientId || !clientSecret || !subscriptionId) {
    return res.status(400).json({
      error: 'Missing required Azure credentials',
      required: ['tenantId', 'clientId', 'clientSecret', 'subscriptionId']
    });
  }
  try {
    const findings = await azureScanner.scan({ tenantId, clientId, clientSecret, subscriptionId });
    const enriched = await Promise.all(findings.map(async (f) => {
      try { return { ...f, ...(await mlClient.predict(f)) }; }
      catch { return { ...f, riskScore: 50, riskLabel: 'MEDIUM', confidence: 0.5 }; }
    }));
    await dbService.saveScan('azure', enriched);
    res.json({ provider: 'azure', findings: enriched, total: enriched.length });
  } catch (err) {
    console.error('Azure scan error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;