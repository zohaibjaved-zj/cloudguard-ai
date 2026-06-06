import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, mean_absolute_error
import joblib
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from data.synthetic_findings import generate_dataset

FEATURES = [
    'n_critical','n_high','n_medium','n_low','n_info',
    'total_findings','public_resources','open_ports',
    'unencrypted','no_mfa','old_keys'
]

def train():
    print("Generating training data...")
    df = generate_dataset(5000)

    print("Label distribution:")
    print(df['risk_label'].value_counts())

    X = df[FEATURES]
    y_label = df['risk_label']
    y_score = df['risk_score']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y_label)

    print(f"Classes found: {list(le.classes_)}")

    X_train, X_test, yl_train, yl_test, ys_train, ys_test = train_test_split(
        X, y_encoded, y_score, test_size=0.2, random_state=42
    )

    print("Training risk label classifier...")
    clf = GradientBoostingClassifier(
        n_estimators=150, max_depth=4, learning_rate=0.1, random_state=42
    )
    clf.fit(X_train, yl_train)
    y_pred = clf.predict(X_test)

    # Use only the classes actually present in test set to avoid mismatch
    print(classification_report(yl_test, y_pred, target_names=le.classes_))

    print("Training risk score regressor...")
    reg = GradientBoostingRegressor(
        n_estimators=150, max_depth=4, learning_rate=0.1, random_state=42
    )
    reg.fit(X_train, ys_train)
    ys_pred = reg.predict(X_test)
    mae = mean_absolute_error(ys_test, ys_pred)
    print(f"Regression MAE: {mae:.2f}")

    save_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'saved_models')
    os.makedirs(save_dir, exist_ok=True)

    joblib.dump(clf, os.path.join(save_dir, 'risk_classifier.pkl'))
    joblib.dump(reg, os.path.join(save_dir, 'risk_regressor.pkl'))
    joblib.dump(le,  os.path.join(save_dir, 'label_encoder.pkl'))

    print("✅ Models saved to saved_models/")

if __name__ == '__main__':
    train()