from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pydantic import BaseModel
from typing import Optional
from ai_service import get_mentor_feedback
from db_service import save_conversation, update_user_profile
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AlgoMentor API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Submission(BaseModel):
    user_id: str
    problem: str
    code: str
    thinking: Optional[str] = ""

@app.post("/submit")
async def process_submission(submission: Submission):
    try:
        # 1. Get AI feedback from Gemini
        ai_response = get_mentor_feedback(
            problem=submission.problem,
            code=submission.code,
            thinking=submission.thinking
        )
        
        # 2. Extract weak concept (if any) and update DB
        weak_concept = extract_weak_concept(ai_response)
        
        # 3. Save to Firebase (or Mock Firebase)
        save_conversation(submission.user_id, submission.dict(), ai_response)
        
        if weak_concept:
            update_user_profile(submission.user_id, weak_concept)
        
        return {"status": "success", "feedback": ai_response}
    except Exception as e:
        print(f"Error processing submission: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_weak_concept(response_text: str) -> Optional[str]:
    """
    Parses the structured output from Gemini to find the 'Weak concept: [tag]'
    """
    import re
    # Look for "Weak concept: tag" or "Weak concept: [tag]"
    match = re.search(r"Weak concept:\s*\[?(.*?)\]?(?:\n|$)", response_text, re.IGNORECASE)
    if match:
        tag = match.group(1).strip()
        # Remove markdown bolding if present
        tag = tag.replace("**", "")
        return tag
    return None

# Serve static files if they exist (for production)
if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
