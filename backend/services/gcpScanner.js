const { Storage } = require('@google-cloud/storage')

const scan = async ({ projectId, credentials }) => {
  const findings = []
  let parsedCreds

  try {
    parsedCreds = typeof credentials === 'string' ? JSON.parse(credentials) : credentials
  } catch {
    return [{ provider: 'gcp', service: 'Auth', checkType: 'credentials', severity: 'CRITICAL', resourceId: projectId, description: 'Invalid GCP credentials JSON.' }]
  }

  try {
    const storage = new Storage({ projectId, credentials: parsedCreds })
    const [buckets] = await storage.getBuckets()

    for (const bucket of buckets) {
      const [meta] = await bucket.getMetadata()

      // Public IAM
      try {
        const [policy] = await bucket.iam.getPolicy()
        const isPublic = (policy.bindings || []).some(b =>
          b.members?.some(m => m === 'allUsers' || m === 'allAuthenticatedUsers')
        )
        if (isPublic) {
          findings.push({
            provider: 'gcp', service: 'GCS', checkType: 'public_iam',
            severity: 'CRITICAL', resourceId: bucket.name,
            description: `GCS bucket "${bucket.name}" is publicly accessible via IAM.`,
            publicExposure: true, encryption: false,
          })
        }
      } catch {}

      // Uniform bucket access
      if (!meta.iamConfiguration?.uniformBucketLevelAccess?.enabled) {
        findings.push({
          provider: 'gcp', service: 'GCS', checkType: 'uniform_access',
          severity: 'MEDIUM', resourceId: bucket.name,
          description: `GCS bucket "${bucket.name}" does not use uniform bucket-level access.`,
          publicExposure: false, encryption: false,
        })
      }

      // Versioning
      if (!meta.versioning?.enabled) {
        findings.push({
          provider: 'gcp', service: 'GCS', checkType: 'versioning',
          severity: 'LOW', resourceId: bucket.name,
          description: `GCS bucket "${bucket.name}" has versioning disabled.`,
          publicExposure: false, encryption: true,
        })
      }
    }
  } catch (err) {
    console.warn('GCP scan failed:', err.message)
  }

  return findings
}

module.exports = { scan }