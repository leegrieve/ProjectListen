from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .models import ChatRequest, ChatResponse, ConversationSummary
from .services.conversation_service import ConversationService

app = FastAPI(title="Project LISTEN API", description="AI Discovery Bot for Access Group")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

conversation_service = ConversationService()

@app.get("/")
def read_root():
    return {"message": "Project LISTEN API - AI Discovery Bot for Access Group"}

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Send a message and get AI response"""
    try:
        conversation_id = request.conversation_id
        if not conversation_id:
            conversation_id = conversation_service.create_conversation()
        
        ai_response = conversation_service.process_message(conversation_id, request.message)
        
        conversation = conversation_service.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return ChatResponse(
            response=ai_response,
            conversation_id=conversation_id,
            discovered_pain_points=conversation.discovered_pain_points,
            recommended_products=conversation.recommended_products
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/conversation/{conversation_id}")
def get_conversation(conversation_id: str):
    """Get conversation history"""
    conversation = conversation_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@app.get("/api/recommendations/{conversation_id}")
def get_recommendations(conversation_id: str):
    """Get product recommendations for a conversation"""
    conversation = conversation_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    relevant_challenges = conversation_service.product_matcher.get_relevant_challenges(
        conversation.discovered_pain_points
    )
    
    return {
        "conversation_id": conversation_id,
        "discovered_pain_points": conversation.discovered_pain_points,
        "recommended_products": conversation.recommended_products,
        "relevant_challenges": relevant_challenges
    }

@app.get("/api/summary/{conversation_id}", response_model=ConversationSummary)
def get_summary(conversation_id: str):
    """Get conversation summary and insights"""
    summary = conversation_service.get_conversation_summary(conversation_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return summary

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Project LISTEN API"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
