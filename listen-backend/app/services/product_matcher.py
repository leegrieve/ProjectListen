import json
import re
from typing import List, Dict, Any
from pathlib import Path

class ProductMatcher:
    def __init__(self):
        self.challenges_data = self._load_challenges_data()
        self.pain_point_keywords = self._build_keyword_mapping()
    
    def _load_challenges_data(self) -> List[Dict[str, Any]]:
        """Load the challenges data from JSON file"""
        data_path = Path(__file__).parent.parent.parent / "challenges_data.json"
        with open(data_path, 'r') as f:
            return json.load(f)
    
    def _build_keyword_mapping(self) -> Dict[str, List[str]]:
        """Build keyword mapping for pain point detection"""
        keywords = {
            "seasonal_fluctuations": ["summer", "winter", "seasonal", "busy", "quiet", "madness", "dead", "fluctuation"],
            "booking_management": ["booking", "reservation", "double booking", "lost booking", "track", "channels"],
            "revenue_optimization": ["revenue", "no-show", "turnover", "covers", "profit", "money", "income"],
            "staff_scheduling": ["staff", "scheduling", "roster", "holiday", "requests", "shifts", "rota"],
            "operational_efficiency": ["manual", "time", "wastage", "efficiency", "automation", "process", "paper", "handwriting", "orders", "menu", "written", "diary"],
            "customer_experience": ["customer", "guest", "satisfaction", "experience", "service", "complaints"],
            "data_intelligence": ["data", "insights", "analytics", "reporting", "forecasting", "patterns"],
            "digital_transformation": ["paper", "manual", "handwritten", "diary", "digital", "modernize", "technology"]
        }
        return keywords
    
    def detect_pain_points(self, conversation_text: str) -> List[str]:
        """Detect pain points from conversation text"""
        detected_points = []
        text_lower = conversation_text.lower()
        
        for category, keywords in self.pain_point_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_points.append(category)
        
        return list(set(detected_points))
    
    def get_relevant_challenges(self, pain_points: List[str]) -> List[Dict[str, Any]]:
        """Get challenges that match detected pain points"""
        relevant_challenges = []
        
        for challenge in self.challenges_data:
            challenge_category = challenge.get('challenge_category', '').lower()
            pain_point_text = challenge.get('customer_pain_point', '').lower()
            
            for pain_point in pain_points:
                pain_point_clean = pain_point.replace('_', ' ')
                if (pain_point_clean in challenge_category or 
                    any(keyword in pain_point_text for keyword in self.pain_point_keywords.get(pain_point, []))):
                    relevant_challenges.append(challenge)
                    break
        
        return relevant_challenges
    
    def get_product_recommendations(self, pain_points: List[str]) -> List[str]:
        """Get product recommendations based on pain points"""
        relevant_challenges = self.get_relevant_challenges(pain_points)
        products = set()
        
        for challenge in relevant_challenges:
            product = challenge.get('product')
            if product:
                products.add(product)
        
        return list(products)
