# LangGraph + Gemini Flash 2.0 chat flow
# Requirements: pip install fastapi uvicorn langgraph google-generativeai
import google.generativeai as genai
from langgraph.graph import StateGraph, END
from pydantic import BaseModel

genai.configure()  # Uses GOOGLE_API_KEY from environment

class ChatState(BaseModel):
    input: str
    output: str = ""

def gemini_llm(state: ChatState) -> ChatState:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(state.input)
    return ChatState(input=state.input, output=response.text)

graph = StateGraph(state_schema=ChatState)
graph.add_node("llm", gemini_llm)
graph.set_entry_point("llm")
graph.add_edge("llm", END)
chat_flow = graph.compile()

def chat_with_gemini(message: str) -> str:
    result = chat_flow.invoke(ChatState(input=message))
    return result["output"]
