import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalies(samples: list) -> list:
    """
    Takes a list of SQLAlchemy coal sample models or dicts,
    runs them through an Isolation Forest, and returns the list
    with 'is_anomaly' and 'anomaly_score' appended.
    """
    if not samples:
        return []
        
    # Convert list of objects/dicts to a list of dicts
    data = []
    for s in samples:
        if isinstance(s, dict):
            data.append(s)
        else:
            # Assuming it's an SQLAlchemy model, convert to dict
            data.append({
                "id": s.id,
                "sample_id": s.sample_id,
                "mine_name": s.mine_name,
                "moisture": s.moisture,
                "ash": s.ash,
                "volatile_matter": s.volatile_matter,
                "fixed_carbon": s.fixed_carbon,
                "gcv": s.gcv,
                "sulfur": s.sulfur
            })
            
    df = pd.DataFrame(data)
    
    # Features to use for anomaly detection
    features = ['moisture', 'ash', 'volatile_matter', 'fixed_carbon', 'gcv', 'sulfur']
    
    # We only train if we have enough data (e.g. > 5 samples)
    if len(df) < 5:
        # Not enough data to find meaningful anomalies, mark all as normal
        for row in data:
            row['is_anomaly'] = False
            row['anomaly_score'] = 0.0
        return data
        
    X = df[features].fillna(0) # Basic imputation for missing values
    
    # Initialize Isolation Forest
    # contamination=0.1 means we expect roughly 10% of samples to be anomalies
    clf = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    
    # Fit and predict
    # Predict returns 1 for inliers, -1 for outliers
    preds = clf.fit_predict(X)
    
    # Decision function returns anomaly scores (lower means more anomalous)
    # We normalize this to a 0-100 scale where higher = more anomalous for our UI
    scores = clf.decision_function(X)
    
    # Normalize scores: invert and scale to 0-100
    # Original scores are usually between -0.5 and 0.5
    normalized_scores = 100 * (0.5 - scores)
    # Clip to 0-100 range just in case
    normalized_scores = np.clip(normalized_scores, 0, 100)
    
    # Attach results back to the dictionaries
    for i, row in enumerate(data):
        row['is_anomaly'] = bool(preds[i] == -1)
        # Round the score for cleaner frontend display
        row['anomaly_score'] = round(float(normalized_scores[i]), 1)
        
    # Sort so anomalies are at the top
    data.sort(key=lambda x: x['anomaly_score'], reverse=True)
        
    return data
