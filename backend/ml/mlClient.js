const axios = require('axios');

const ML_URL = process.env.ML_SERVICE_URL || 'http://cloudguard_ml:8000';

const predict = async (finding) => {
  const response = await axios.post(`${ML_URL}/predict`, {
    severity:        finding.severity || 'MEDIUM',
    provider:        finding.provider || 'aws',
    service:         finding.service || 'unknown',
    check_type:      finding.checkType || finding.check_type || 'unknown',
    resource_count:  finding.resourceCount || 1,
    public_exposure: finding.publicExposure ? 1 : 0,
    encryption:      finding.encryption ? 1 : 0,
    mfa_enabled:     finding.mfaEnabled ? 1 : 0,
  }, { timeout: 5000 });

  return {
    riskScore:    response.data.risk_score,
    riskLabel:    response.data.risk_label,
    confidence:   response.data.confidence,
    features:     response.data.feature_contributions || [],
    recommendations: response.data.recommendations || [],
  };
};

module.exports = { predict };