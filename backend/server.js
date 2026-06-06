require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Root health check
app.get('/', (req, res) => {
  res.json({
    service: 'CloudGuard v2 API',
    status: 'running',
    version: '2.0.0',
    endpoints: {
      health:     'GET  /health',
      awsScan:    'POST /api/aws/scan',
      azureScan:  'POST /api/azure/scan',
      gcpScan:    'POST /api/gcp/scan',
      analytics:  'GET  /api/analytics/dashboard',
      alerts:     'GET  /api/alerts',
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CloudGuard API v2', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/aws',       require('./routes/aws'));
app.use('/api/azure',     require('./routes/azure'));
app.use('/api/gcp',       require('./routes/gcp'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/alerts',    require('./routes/alerts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CloudGuard v2 API running on http://localhost:${PORT}`);
});