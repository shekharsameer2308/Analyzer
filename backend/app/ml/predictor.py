import pandas as pd
from xgboost import XGBRegressor
from app.models.coal_sample import CoalSample

def predict_gcv(samples: list[CoalSample], input_features: dict) -> float:
    """
    Trains an XGBoost regression model in-memory using all existing samples
    and predicts the GCV for the provided input features.
    
    input_features must contain:
    - moisture
    - ash
    - volatile_matter
    - fixed_carbon
    """
    if not samples or len(samples) < 5:
        # Not enough data to train a meaningful model
        return 0.0
        
    # Convert samples to DataFrame
    data = []
    for s in samples:
        data.append({
            'moisture': s.moisture,
            'ash': s.ash,
            'volatile_matter': s.volatile_matter,
            'fixed_carbon': s.fixed_carbon,
            'gcv': s.gcv
        })
        
    df = pd.DataFrame(data)
    
    # Simple imputation for any NaN values
    df = df.fillna(df.mean())
    
    # Define features (X) and target (y)
    X = df[['moisture', 'ash', 'volatile_matter', 'fixed_carbon']]
    y = df['gcv']
    
    # Initialize and train the XGBoost Regressor
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X, y)
    
    # Prepare input for prediction
    input_df = pd.DataFrame([{
        'moisture': input_features['moisture'],
        'ash': input_features['ash'],
        'volatile_matter': input_features['volatile_matter'],
        'fixed_carbon': input_features['fixed_carbon']
    }])
    
    # Predict and return
    prediction = model.predict(input_df)[0]
    
    return float(prediction)
