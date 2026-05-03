import os
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase conditionally
db = None
try:
    cred_path = os.getenv("FIREBASE_CREDENTIALS")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase initialized successfully.")
    else:
        print("Warning: FIREBASE_CREDENTIALS not found. Running with mock database.")
except Exception as e:
    print(f"Failed to initialize Firebase: {e}. Running with mock database.")

def save_conversation(user_id: str, request_data: dict, ai_response: str):
    """
    Saves the user submission and AI response to the user's history.
    """
    if db:
        try:
            doc_ref = db.collection("users").document(user_id).collection("history").document()
            doc_ref.set({
                "timestamp": datetime.utcnow(),
                "problem": request_data.get("problem"),
                "code": request_data.get("code"),
                "thinking": request_data.get("thinking"),
                "ai_response": ai_response
            })
        except Exception as e:
            print(f"Error saving to Firebase: {e}")
    else:
        print(f"[MOCK DB] Saved conversation for user {user_id}")


def update_user_profile(user_id: str, weak_concept: str):
    """
    Updates the user's profile, recording the identified concept gap.
    """
    if db:
        try:
            user_ref = db.collection("users").document(user_id)
            # We can use array_union to add without duplicating
            user_ref.set({
                "weak_concepts": firestore.ArrayUnion([weak_concept]),
                "last_active": datetime.utcnow()
            }, merge=True)
        except Exception as e:
            print(f"Error updating user profile in Firebase: {e}")
    else:
        print(f"[MOCK DB] Added weak concept '{weak_concept}' for user {user_id}")
