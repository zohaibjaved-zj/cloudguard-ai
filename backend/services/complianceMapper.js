const COMPLIANCE_MAP = {
  public_access:        { cis: 'CIS 2.1.1', nist: 'AC-3', soc2: 'CC6.1' },
  encryption:           { cis: 'CIS 2.1.3', nist: 'SC-28', soc2: 'CC6.7' },
  versioning:           { cis: 'CIS 2.1.4', nist: 'CP-9', soc2: 'A1.2' },
  password_policy:      { cis: 'CIS 1.8',   nist: 'IA-5', soc2: 'CC6.1' },
  access_key_rotation:  { cis: 'CIS 1.14',  nist: 'IA-5', soc2: 'CC6.1' },
  open_security_group:  { cis: 'CIS 5.2',   nist: 'SC-7', soc2: 'CC6.6' },
  https_enforcement:    { cis: 'CIS 3.1',   nist: 'SC-8', soc2: 'CC6.7' },
  public_blob_access:   { cis: 'CIS 3.5',   nist: 'AC-3', soc2: 'CC6.1' },
  nsg_permissive:       { cis: 'CIS 6.1',   nist: 'SC-7', soc2: 'CC6.6' },
  tls_version:          { cis: 'CIS 3.7',   nist: 'SC-8', soc2: 'CC6.7' },
  public_iam:           { cis: 'CIS 5.1',   nist: 'AC-3', soc2: 'CC6.1' },
  uniform_access:       { cis: 'CIS 5.2',   nist: 'AC-6', soc2: 'CC6.3' },
};

const mapCompliance = (checkType) => {
  return COMPLIANCE_MAP[checkType] || { cis: 'N/A', nist: 'N/A', soc2: 'N/A' };
};

module.exports = { mapCompliance };