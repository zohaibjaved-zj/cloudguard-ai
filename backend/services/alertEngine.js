const alertEngine = {
  evaluate: (findings, rules) => {
    const triggered = [];
    for (const finding of findings) {
      for (const rule of rules) {
        const providerMatch = rule.provider === 'all' || rule.provider === finding.provider;
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const severityMatch = severities.indexOf(finding.severity) >= severities.indexOf(rule.severity);
        if (providerMatch && severityMatch) {
          triggered.push({ rule, finding });
        }
      }
    }
    return triggered;
  }
};

module.exports = alertEngine;