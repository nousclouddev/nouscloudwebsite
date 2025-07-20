# FastAPI server for chatbot API
# Requirements: pip install fastapi uvicorn langgraph google-generativeai
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from chat_flow import chat_with_gemini
from mangum import Mangum

app = FastAPI()

# Define allowed origins - update this with your frontend domain(s)
origins = [
    "http://localhost:3000",           # Local development
    "https://nouscloud.com",           # Production domain (update with your actual domain)
    "https://www.nouscloud.com",       # www subdomain
    "*"                                # Allow all origins during development (remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    max_age=86400,  # CORS preflight request cache for 24 hours
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chatbot/send")
async def chatbot_send(req: ChatRequest):
    if not req.message:
        return {"error": "No message provided"}
    try:
        response = chat_with_gemini(req.message)
        print("Gemini response:", response)  # Debug print
        return {"response": response}
    except Exception as e:
        print("Error:", str(e))  # Debug print
        return {"error": str(e)}

handler = Mangum(app)
