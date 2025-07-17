from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime

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

@app.get("/api/conversations/{conversation_id}/export")
def export_conversation(conversation_id: str):
    """Export a complete conversation as JSON"""
    try:
        conversation = conversation_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        export_data = {
            "conversation_id": conversation.conversation_id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat(),
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat()
                }
                for msg in conversation.messages
            ],
            "discovered_pain_points": conversation.discovered_pain_points,
            "recommended_products": conversation.recommended_products,
            "customer_context": conversation.customer_context,
            "summary": {
                "total_messages": len(conversation.messages),
                "user_messages": len([m for m in conversation.messages if m.role == "user"]),
                "assistant_messages": len([m for m in conversation.messages if m.role == "assistant"]),
                "pain_points_count": len(conversation.discovered_pain_points),
                "products_count": len(conversation.recommended_products)
            }
        }
        
        return export_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in export endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/conversations/export-all")
def export_all_conversations():
    """Export all conversations as JSON"""
    try:
        all_conversations = []
        for conversation_id, conversation in conversation_service.conversations.items():
            export_data = {
                "conversation_id": conversation.conversation_id,
                "created_at": conversation.created_at.isoformat(),
                "updated_at": conversation.updated_at.isoformat(),
                "messages": [
                    {
                        "role": msg.role,
                        "content": msg.content,
                        "timestamp": msg.timestamp.isoformat()
                    }
                    for msg in conversation.messages
                ],
                "discovered_pain_points": conversation.discovered_pain_points,
                "recommended_products": conversation.recommended_products,
                "customer_context": conversation.customer_context,
                "summary": {
                    "total_messages": len(conversation.messages),
                    "user_messages": len([m for m in conversation.messages if m.role == "user"]),
                    "assistant_messages": len([m for m in conversation.messages if m.role == "assistant"]),
                    "pain_points_count": len(conversation.discovered_pain_points),
                    "products_count": len(conversation.recommended_products)
                }
            }
            all_conversations.append(export_data)
        
        return {
            "export_timestamp": datetime.now().isoformat(),
            "total_conversations": len(all_conversations),
            "conversations": all_conversations
        }
    
    except Exception as e:
        print(f"Error in export-all endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Project LISTEN API"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
