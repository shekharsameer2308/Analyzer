from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import os

from app.core.database import get_db
from app.models.coal_sample import CoalSample
from app.core.config import settings

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/chat")
def chat_insights(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch database statistics for context
    total_samples = db.query(func.count(CoalSample.id)).scalar() or 0
    avg_gcv = db.query(func.avg(CoalSample.gcv)).scalar() or 0.0
    avg_ash = db.query(func.avg(CoalSample.ash)).scalar() or 0.0
    avg_moisture = db.query(func.avg(CoalSample.moisture)).scalar() or 0.0
    avg_quality = db.query(func.avg(CoalSample.quality_score)).scalar() or 0.0
    
    # Query anomaly count in the database
    anomaly_count = db.query(func.count(CoalSample.id)).filter(CoalSample.is_anomaly == True).scalar() or 0
    
    # Group by mine name
    mine_results = db.query(
        CoalSample.mine_name,
        func.count(CoalSample.id).label('count'),
        func.avg(CoalSample.gcv).label('avg_gcv')
    ).group_by(CoalSample.mine_name).all()
    
    mine_distribution = [
        f"- {r.mine_name}: {r.count} samples, average GCV {round(r.avg_gcv or 0, 1)} kcal/kg"
        for r in mine_results
    ]
    mine_dist_str = "\n".join(mine_distribution)

    # 2. Get the last user message
    user_messages = [m for m in request.messages if m.role == 'user']
    if not user_messages:
        raise HTTPException(status_code=400, detail="No user message found.")
    last_query = user_messages[-1].text
    
    # 3. Create context prompt
    system_context = f"""
You are CoalLab AI, an expert industrial coal quality analytics assistant.
Here is the current live data summary from the coal processing plant:
- Total Coal Samples: {total_samples}
- Overall Quality Score Index: {round(avg_quality, 1)}%
- Average Gross Calorific Value (GCV): {round(avg_gcv, 1)} kcal/kg
- Average Ash Content: {round(avg_ash, 1)}%
- Average Moisture Content: {round(avg_moisture, 1)}%
- Total Anomalies Identified: {anomaly_count}
- Samples Distribution by Mine Source:
{mine_dist_str}

Please answer the user's questions concisely and professionally. Address the user queries based on this data. Do not use emojis in your response.
"""

    # 4. Attempt Gemini API call
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            
            # Setup generation model
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_context
            )
            
            # Convert messages history format for Gemini
            chat_history = []
            for msg in request.messages[:-1]:
                role = "user" if msg.role == "user" else "model"
                chat_history.append({"role": role, "parts": [msg.text]})
                
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(last_query)
            
            return {
                "status": "success",
                "text": response.text.strip(),
                "source": "gemini"
            }
        except Exception as e:
            print(f"Gemini API call failed: {e}. Using smart heuristic fallback.")
            
    # 5. Smart analytical fallback logic
    query_lower = last_query.lower()
    
    if "anomaly" in query_lower or "outlier" in query_lower or "irregular" in query_lower:
        fallback_text = (
            f"According to the database analysis, out of {total_samples} samples, "
            f"we have detected {anomaly_count} high-risk anomalies using the Isolation Forest model. "
            f"The anomalies are primarily characterized by excessive moisture (>14%) or ash levels (>40%) "
            f"that deviate significantly from standard mine profiles. I suggest checking the Anomaly Alerts "
            f"dashboard to review specific sample IDs and investigate potential sensor calibration errors."
        )
    elif "blend" in query_lower or "optimiz" in query_lower or "mix" in query_lower:
        fallback_text = (
            f"To achieve an optimal blend quality, you can use the Blending Optimizer tool. "
            f"Given our current mine profile (average GCV of {round(avg_gcv, 1)} kcal/kg), blending high-heat coal "
            f"from Alpha Washery with low-cost coal from Beta Colliery yields the highest financial efficiency "
            f"while maintaining sulfur and moisture values within target tolerances."
        )
    elif "gcv" in query_lower or "heat" in query_lower or "calorific" in query_lower:
        fallback_text = (
            f"The overall average Gross Calorific Value (GCV) is currently {round(avg_gcv, 1)} kcal/kg. "
            f"Alpha Washery yields the highest quality profiles, while Beta Colliery exhibits lower values due to "
            f"higher ash margins. Let me know if you would like to run a predictive estimation on new raw parameters."
        )
    elif "ash" in query_lower or "impurity" in query_lower or "moisture" in query_lower:
        fallback_text = (
            f"The overall average ash content is {round(avg_ash, 1)}% and total moisture is {round(avg_moisture, 1)}%. "
            f"High moisture levels directly reduce the heat value output. We recommend maintaining moisture below 12.0% "
            f"to optimize total calorific output."
        )
    else:
        fallback_text = (
            f"Hello! I am CoalLab AI. I am currently monitoring {total_samples} processed samples "
            f"with an overall quality score of {round(avg_quality, 1)}%. "
            f"I can help you analyze sample properties, explain anomaly scores, or recommend "
            f"optimized coal blending ratios. What specific quality metrics would you like to explore?"
        )
        
    return {
        "status": "success",
        "text": fallback_text,
        "source": "fallback"
    }
