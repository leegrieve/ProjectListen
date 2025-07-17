from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime

class ConversationState(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]
    discovered_pain_points: List[str]
    customer_context: Dict[str, Any]
    recommended_products: List[str]
    created_at: datetime
    updated_at: datetime

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    discovered_pain_points: List[str]
    recommended_products: List[str]

class ConversationSummary(BaseModel):
    conversation_id: str
    customer_context: Dict[str, Any]
    discovered_pain_points: List[str]
    recommended_products: List[str]
    key_insights: List[str]
    flight_path_progress: str
