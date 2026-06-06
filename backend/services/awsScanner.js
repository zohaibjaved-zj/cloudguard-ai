const { IAMClient, GetAccountPasswordPolicyCommand, ListUsersCommand, ListAccessKeysCommand } = require('@aws-sdk/client-iam')
const { S3Client, ListBucketsCommand, GetBucketAclCommand, GetBucketEncryptionCommand, GetBucketVersioningCommand, GetPublicAccessBlockCommand } = require('@aws-sdk/client-s3')
const { EC2Client, DescribeSecurityGroupsCommand } = require('@aws-sdk/client-ec2')

const scan = async ({ accessKeyId, secretAccessKey, region }) => {
  const credentials = { accessKeyId, secretAccessKey }
  const findings = []

  // ── IAM Password Policy ──
  try {
    const iam = new IAMClient({ credentials, region })
    const policy = await iam.send(new GetAccountPasswordPolicyCommand({}))
    const p = policy.PasswordPolicy
    if (!p.RequireMFADevice) {
      findings.push({
        provider: 'aws', service: 'IAM', checkType: 'password_policy',
        severity: 'HIGH', resourceId: 'account-password-policy',
        description: 'IAM password policy does not require MFA.',
        publicExposure: false, encryption: false, mfaEnabled: false,
      })
    }
    if ((p.MinimumPasswordLength || 0) < 14) {
      findings.push({
        provider: 'aws', service: 'IAM', checkType: 'password_policy',
        severity: 'MEDIUM', resourceId: 'account-password-policy',
        description: `IAM password minimum length is ${p.MinimumPasswordLength || 0}, should be 14+.`,
        publicExposure: false, encryption: false,
      })
    }
  } catch (err) {
    console.warn('IAM policy check failed:', err.message)
  }

  // ── S3 Buckets ──
  try {
    const s3 = new S3Client({ credentials, region })
    const { Buckets } = await s3.send(new ListBucketsCommand({}))

    for (const bucket of (Buckets || [])) {
      const name = bucket.Name

      // Public access block
      try {
        const pub = await s3.send(new GetPublicAccessBlockCommand({ Bucket: name }))
        const cfg = pub.PublicAccessBlockConfiguration
        if (!cfg.BlockPublicAcls || !cfg.BlockPublicPolicy) {
          findings.push({
            provider: 'aws', service: 'S3', checkType: 'public_access',
            severity: 'CRITICAL', resourceId: name,
            description: `S3 bucket "${name}" does not block public access.`,
            publicExposure: true, encryption: false,
          })
        }
      } catch {}

      // Encryption
      try {
        await s3.send(new GetBucketEncryptionCommand({ Bucket: name }))
      } catch (err) {
        if (err.name === 'ServerSideEncryptionConfigurationNotFoundError') {
          findings.push({
            provider: 'aws', service: 'S3', checkType: 'encryption',
            severity: 'MEDIUM', resourceId: name,
            description: `S3 bucket "${name}" has no server-side encryption.`,
            publicExposure: false, encryption: false,
          })
        }
      }

      // Versioning
      try {
        const ver = await s3.send(new GetBucketVersioningCommand({ Bucket: name }))
        if (ver.Status !== 'Enabled') {
          findings.push({
            provider: 'aws', service: 'S3', checkType: 'versioning',
            severity: 'LOW', resourceId: name,
            description: `S3 bucket "${name}" has versioning disabled.`,
            publicExposure: false, encryption: true,
          })
        }
      } catch {}
    }
  } catch (err) {
    console.warn('S3 scan failed:', err.message)
  }

  // ── EC2 Security Groups ──
  try {
    const ec2 = new EC2Client({ credentials, region })
    const { SecurityGroups } = await ec2.send(new DescribeSecurityGroupsCommand({}))

    const RISKY_PORTS = [22, 3389, 3306, 5432, 27017]
    for (const sg of (SecurityGroups || [])) {
      for (const rule of (sg.IpPermissions || [])) {
        const openToAll = (rule.IpRanges || []).some(r => r.CidrIp === '0.0.0.0/0')
        if (openToAll && RISKY_PORTS.includes(rule.FromPort)) {
          findings.push({
            provider: 'aws', service: 'EC2', checkType: 'open_security_group',
            severity: 'HIGH', resourceId: sg.GroupId,
            description: `Security group "${sg.GroupName}" allows port ${rule.FromPort} from 0.0.0.0/0.`,
            publicExposure: true, encryption: false,
          })
        }
      }
    }
  } catch (err) {
    console.warn('EC2 scan failed:', err.message)
  }

  return findings
}

module.exports = { scan }