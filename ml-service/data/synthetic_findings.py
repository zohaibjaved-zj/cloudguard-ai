import pandas as pd
import numpy as np
import random

SERVICES = ['IAM', 'S3', 'EC2', 'RDS', 'Network', 'Storage', 'GCS', 'NSG']
PROVIDERS = ['aws', 'azure', 'gcp']

def generate_dataset(n=3000):
    rows = []
    for _ in range(n):
        provider   = random.choice(PROVIDERS)
        n_critical = random.randint(0, 8)
        n_high     = random.randint(0, 12)
        n_medium   = random.randint(0, 15)
        n_low      = random.randint(0, 20)
        n_info     = random.randint(0, 10)
        total      = n_critical + n_high + n_medium + n_low + n_info
        public_resources = random.randint(0, 5)
        open_ports       = random.randint(0, 10)
        unencrypted      = random.randint(0, 8)
        no_mfa           = random.randint(0, 3)
        old_keys         = random.randint(0, 5)

        raw_score = (
            n_critical * 10 + n_high * 7 + n_medium * 4 +
            n_low * 2 + n_info * 1 +
            public_resources * 8 + open_ports * 5 +
            unencrypted * 6 + no_mfa * 9 + old_keys * 4
        )
        noise = random.uniform(-5, 5)
        risk_score = min(100, max(0, raw_score / 2 + noise))

        if risk_score >= 70:   label = 'CRITICAL'
        elif risk_score >= 45: label = 'HIGH'
        elif risk_score >= 20: label = 'MEDIUM'
        else:                  label = 'LOW'

        rows.append({
            'provider': provider,
            'n_critical': n_critical, 'n_high': n_high,
            'n_medium': n_medium,     'n_low': n_low, 'n_info': n_info,
            'total_findings': total,  'public_resources': public_resources,
            'open_ports': open_ports, 'unencrypted': unencrypted,
            'no_mfa': no_mfa,         'old_keys': old_keys,
            'risk_score': round(risk_score, 2),
            'risk_label': label,
        })
    return pd.DataFrame(rows)

if __name__ == '__main__':
    df = generate_dataset()
    df.to_csv('training_data.csv', index=False)
    print(f"Generated {len(df)} rows")