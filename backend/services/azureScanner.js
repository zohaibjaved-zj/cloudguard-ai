const { ClientSecretCredential } = require('@azure/identity')
const { StorageManagementClient }  = require('@azure/arm-storage')
const { NetworkManagementClient }  = require('@azure/arm-network')

const scan = async ({ tenantId, clientId, clientSecret, subscriptionId }) => {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret)
  const findings = []

  // ── Storage Accounts ──
  try {
    const storageClient = new StorageManagementClient(credential, subscriptionId)
    for await (const account of storageClient.storageAccounts.list()) {
      if (!account.enableHttpsTrafficOnly) {
        findings.push({
          provider: 'azure', service: 'Storage', checkType: 'https_enforcement',
          severity: 'HIGH', resourceId: account.name,
          description: `Storage account "${account.name}" does not enforce HTTPS.`,
          publicExposure: true, encryption: false,
        })
      }
      if (account.allowBlobPublicAccess) {
        findings.push({
          provider: 'azure', service: 'Storage', checkType: 'public_blob_access',
          severity: 'CRITICAL', resourceId: account.name,
          description: `Storage account "${account.name}" allows public blob access.`,
          publicExposure: true, encryption: false,
        })
      }
      if (account.minimumTlsVersion !== 'TLS1_2') {
        findings.push({
          provider: 'azure', service: 'Storage', checkType: 'tls_version',
          severity: 'MEDIUM', resourceId: account.name,
          description: `Storage account "${account.name}" uses TLS below 1.2.`,
          publicExposure: false, encryption: false,
        })
      }
    }
  } catch (err) {
    console.warn('Azure storage scan failed:', err.message)
  }

  // ── Network Security Groups ──
  try {
    const networkClient = new NetworkManagementClient(credential, subscriptionId)
    for await (const nsg of networkClient.networkSecurityGroups.listAll()) {
      for (const rule of (nsg.securityRules || [])) {
        if (
          rule.direction === 'Inbound' &&
          rule.access === 'Allow' &&
          rule.sourceAddressPrefix === '*' &&
          rule.destinationPortRange === '*'
        ) {
          findings.push({
            provider: 'azure', service: 'Network', checkType: 'nsg_permissive',
            severity: 'HIGH', resourceId: nsg.name,
            description: `NSG "${nsg.name}" allows all inbound traffic from any source.`,
            publicExposure: true, encryption: false,
          })
        }
      }
    }
  } catch (err) {
    console.warn('Azure NSG scan failed:', err.message)
  }

  return findings
}

module.exports = { scan }