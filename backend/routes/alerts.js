const router = require('express').Router();
const dbService = require('../services/dbService');

router.get('/', async (req, res) => {
  try {
    const alerts = await dbService.getAlerts();
    const rules = await dbService.getAlertRules();
    res.json({ alerts, rules });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rules', async (req, res) => {
  try {
    const rule = await dbService.createAlertRule(req.body);
    res.json({ success: true, rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/rules/:id', async (req, res) => {
  try {
    await dbService.deleteAlertRule(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;