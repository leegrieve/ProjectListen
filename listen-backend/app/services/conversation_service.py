import os
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from anthropic import Anthropic
from dotenv import load_dotenv

from ..models import ConversationState, ChatMessage, ConversationSummary
from .product_matcher import ProductMatcher

load_dotenv()

class ConversationService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.product_matcher = ProductMatcher()
        self.conversations: Dict[str, ConversationState] = {}
        self.system_prompt = self._build_system_prompt()
    
    def _build_system_prompt(self) -> str:
        return """You are an AI discovery bot for Access Group, acting as "The Consultative Industry Expert." Your role is to help match customers to the right products from Access Group's portfolio through intelligent conversation.

CORE PERSONALITY:
- You are NOT a pushy salesperson - you're a consultative expert who genuinely wants to help
- You have deep knowledge of hospitality operations and challenges
- You understand seasonal fluctuations, staffing issues, booking systems, and industry-specific scenarios
- You speak the customer's language and show empathy for their challenges
- You use the "Flight Path" approach - "we're going to do this together"

CONVERSATION APPROACH:
1. ALWAYS start by understanding the business before suggesting any products
2. Ask smart, probing questions that uncover hidden pain points
3. Show empathy with phrases like "I understand summer is madness for you"
4. Don't accept surface-level responses - dig deeper to understand root causes
5. Play back what you hear to confirm understanding
6. Focus on outcomes and business problems, not product features

INDUSTRY EXPERTISE:
- Understand that hospitality businesses face seasonal fluctuations
- Know that "summer is madness while winter is dead" is a common challenge
- Recognize staffing issues, booking management problems, revenue optimization needs
- Understand the difference between "baristas vs waitresses" in context
- Reference industry-specific scenarios naturally

QUESTIONING STYLE:
- Ask follow-up questions like: "Are you finding it difficult to predict how many staff you need week to week?"
- "Are holiday requests causing additional complications with paper forms getting lost?"
- "How are you currently handling booking confirmations?"
- "What happens during your busy periods vs quiet times?"

COMMUNICATION STYLE:
- Clear and direct, no jargon
- Empathetic but professional
- Acknowledge frustrations before diving into solutions
- Confirm understanding frequently
- Maintain focus on solving business problems
- NEVER use asterisked actions, stage directions, or emotive descriptions like "*Nodding empathetically*", "*Shows recognition*", "*Pausing briefly*", "*Enthusiastically but professionally*"
- Express personality and empathy through natural word choice and phrasing, not theatrical descriptions
- Speak naturally without action descriptions - let the consultative tone come through in your words

Remember: Your goal is to uncover pain points through conversation, not to immediately suggest products. Build trust first, understand deeply, then guide toward solutions."""

    def create_conversation(self) -> str:
        """Create a new conversation and return its ID"""
        conversation_id = str(uuid.uuid4())
        now = datetime.now()
        
        self.conversations[conversation_id] = ConversationState(
            conversation_id=conversation_id,
            messages=[],
            discovered_pain_points=[],
            customer_context={},
            recommended_products=[],
            created_at=now,
            updated_at=now
        )
        
        return conversation_id
    
    def get_conversation(self, conversation_id: str) -> Optional[ConversationState]:
        """Get conversation by ID"""
        return self.conversations.get(conversation_id)
    
    def process_message(self, conversation_id: str, user_message: str) -> str:
        """Process user message and return AI response"""
        try:
            if conversation_id not in self.conversations:
                conversation_id = self.create_conversation()
            
            conversation = self.conversations[conversation_id]
            
            user_msg = ChatMessage(
                role="user",
                content=user_message,
                timestamp=datetime.now()
            )
            conversation.messages.append(user_msg)
            
            try:
                full_conversation = " ".join([msg.content for msg in conversation.messages if msg.role == "user"])
                detected_pain_points = self.product_matcher.detect_pain_points(full_conversation)
                
                for pain_point in detected_pain_points:
                    if pain_point not in conversation.discovered_pain_points:
                        conversation.discovered_pain_points.append(pain_point)
                
                conversation.recommended_products = self.product_matcher.get_product_recommendations(
                    conversation.discovered_pain_points
                )
            except Exception as e:
                print(f"Error in pain point detection: {e}")
                pass
            
            messages = []
            for msg in conversation.messages:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
            
            try:
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1000,
                    system=self.system_prompt,
                    messages=messages
                )
                
                ai_response = response.content[0].text
            except Exception as e:
                print(f"Error calling Claude API: {e}")
                raise e
            
            ai_msg = ChatMessage(
                role="assistant",
                content=ai_response,
                timestamp=datetime.now()
            )
            conversation.messages.append(ai_msg)
            conversation.updated_at = datetime.now()
            
            return ai_response
            
        except Exception as e:
            print(f"Error in process_message: {e}")
            import traceback
            traceback.print_exc()
            raise e
    
    def get_conversation_summary(self, conversation_id: str) -> Optional[ConversationSummary]:
        """Get conversation summary with discovered insights"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return None
        
        key_insights = []
        if conversation.discovered_pain_points:
            key_insights.append(f"Identified {len(conversation.discovered_pain_points)} key pain points")
        
        if conversation.recommended_products:
            key_insights.append(f"Recommended {len(conversation.recommended_products)} Access Group products")
        
        progress = "Discovery Phase"
        if len(conversation.discovered_pain_points) > 2:
            progress = "Analysis Phase"
        if conversation.recommended_products:
            progress = "Solution Phase"
        
        return ConversationSummary(
            conversation_id=conversation_id,
            customer_context=conversation.customer_context,
            discovered_pain_points=conversation.discovered_pain_points,
            recommended_products=conversation.recommended_products,
            key_insights=key_insights,
            flight_path_progress=progress
        )
    
    def get_business_summary(self, conversation_id: str) -> Optional[Dict]:
        """Get structured business summary for Access Group takeaway"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return None
        
        relevant_challenges = self.product_matcher.get_relevant_challenges(conversation.discovered_pain_points)
        
        # Structure pain points with solutions
        pain_point_solutions = []
        for pain_point in conversation.discovered_pain_points:
            pain_point_name = pain_point.replace('_', ' ').title()
            
            # Find matching challenges and solutions
            matching_challenges = [c for c in relevant_challenges 
                                 if any(keyword in c.get('customer_pain_point', '').lower() 
                                       for keyword in self.product_matcher.pain_point_keywords.get(pain_point, []))]
            
            solutions = []
            for challenge in matching_challenges:
                if challenge.get('product'):
                    solution = {
                        "product": challenge.get('product'),
                        "how_it_helps": challenge.get('customer_pain_point', ''),
                        "business_impact": challenge.get('challenge_category', ''),
                        "priority": self._calculate_priority(pain_point, challenge)
                    }
                    solutions.append(solution)
            
            pain_point_solutions.append({
                "pain_point": pain_point_name,
                "category": pain_point,
                "solutions": solutions
            })
        
        delivery_plan = self._create_delivery_plan(pain_point_solutions)
        
        return {
            "conversation_id": conversation_id,
            "customer_business_summary": {
                "total_pain_points": len(conversation.discovered_pain_points),
                "conversation_length": len(conversation.messages),
                "discovery_completeness": self._assess_discovery_completeness(conversation)
            },
            "identified_pain_points": pain_point_solutions,
            "recommended_flight_path": delivery_plan,
            "next_steps": self._generate_next_steps(conversation, pain_point_solutions),
            "generated_at": datetime.now().isoformat()
        }
    
    def _calculate_priority(self, pain_point: str, challenge: Dict) -> str:
        """Calculate priority based on pain point type and business impact"""
        high_priority_points = ["revenue_optimization", "operational_efficiency"]
        medium_priority_points = ["staff_scheduling", "booking_management"]
        
        if pain_point in high_priority_points:
            return "High"
        elif pain_point in medium_priority_points:
            return "Medium"
        else:
            return "Low"
    
    def _create_delivery_plan(self, pain_point_solutions: List[Dict]) -> Dict:
        """Create prioritized delivery plan based on pain points"""
        phases = {
            "Phase 1 - Foundation": [],
            "Phase 2 - Optimization": [],
            "Phase 3 - Enhancement": []
        }
        
        for pain_solution in pain_point_solutions:
            for solution in pain_solution.get("solutions", []):
                priority = solution.get("priority", "Low")
                
                if priority == "High":
                    phases["Phase 1 - Foundation"].append({
                        "system": solution.get("product"),
                        "addresses": pain_solution.get("pain_point"),
                        "business_value": solution.get("how_it_helps"),
                        "implementation_priority": "Immediate"
                    })
                elif priority == "Medium":
                    phases["Phase 2 - Optimization"].append({
                        "system": solution.get("product"),
                        "addresses": pain_solution.get("pain_point"),
                        "business_value": solution.get("how_it_helps"),
                        "implementation_priority": "3-6 months"
                    })
                else:
                    phases["Phase 3 - Enhancement"].append({
                        "system": solution.get("product"),
                        "addresses": pain_solution.get("pain_point"),
                        "business_value": solution.get("how_it_helps"),
                        "implementation_priority": "6-12 months"
                    })
        
        return phases
    
    def _assess_discovery_completeness(self, conversation: ConversationState) -> str:
        """Assess how complete the discovery process is"""
        if len(conversation.discovered_pain_points) >= 3 and len(conversation.messages) >= 6:
            return "Comprehensive"
        elif len(conversation.discovered_pain_points) >= 2:
            return "Good"
        else:
            return "Initial"
    
    def _generate_next_steps(self, conversation: ConversationState, pain_point_solutions: List[Dict]) -> List[str]:
        """Generate recommended next steps for Access Group"""
        next_steps = []
        
        if len(conversation.discovered_pain_points) < 3:
            next_steps.append("Continue discovery conversation to uncover additional pain points")
        
        if pain_point_solutions:
            next_steps.append("Schedule technical demonstration of recommended solutions")
            next_steps.append("Conduct detailed requirements gathering for Phase 1 systems")
        
        next_steps.append("Assign dedicated Access Group account manager for implementation planning")
        next_steps.append("Develop custom implementation timeline based on business priorities")
        
        return next_steps
