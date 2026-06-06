const validateKeys = (provider) => {
  return (req, res, next) => {
    const body = req.body;

    if (provider === 'aws') {
      if (!body.accessKeyId || !body.secretAccessKey || !body.region) {
        return res.status(400).json({
          error: 'Missing required AWS credentials',
          required: ['accessKeyId', 'secretAccessKey', 'region']
        });
      }
    }

    if (provider === 'azure') {
      if (!body.tenantId || !body.clientId || !body.clientSecret || !body.subscriptionId) {
        return res.status(400).json({
          error: 'Missing required Azure credentials',
          required: ['tenantId', 'clientId', 'clientSecret', 'subscriptionId']
        });
      }
    }

    if (provider === 'gcp') {
      if (!body.projectId || !body.credentials) {
        return res.status(400).json({
          error: 'Missing required GCP credentials',
          required: ['projectId', 'credentials']
        });
      }
    }

    next();
  };
};

module.exports = validateKeys;