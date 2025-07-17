# Project LISTEN - AI Discovery Bot for Access Group

![Access Group Logo](listen-frontend/public/accesslogo.jpg)

**Project LISTEN** is an AI-powered discovery bot designed to help Access Group match customers with the right products from their 180+ product portfolio through intelligent, consultative conversations.

## 🎯 What Does Project LISTEN Do?

Project LISTEN acts as a **digital consultant** that:

- **Understands Business Challenges**: Engages customers in natural conversation to uncover their specific pain points
- **Provides Expert Guidance**: Uses deep industry knowledge to ask smart, probing questions
- **Recommends Tailored Solutions**: Maps discovered needs to specific Access Group products
- **Builds Custom Flight Paths**: Creates personalized implementation journeys for each customer
- **Tracks Discovery Progress**: Monitors the entire consultation process from initial contact to solution design

## 🤖 The AI Persona: "The Consultative Industry Expert"

The bot embodies a specific persona designed to build trust and uncover genuine business needs:

### Key Characteristics:
- **Empathetic & Understanding**: Shows genuine concern for business challenges
- **Industry Expert**: Deep knowledge of hospitality, retail, and service operations
- **Non-Pushy**: Focuses on understanding before recommending
- **Collaborative**: Uses "we're going to do this together" approach
- **Insightful**: Asks questions that reveal hidden pain points

### Example Interactions:
- *"I completely understand that challenge - summer is madness for hospitality businesses"*
- *"Let me ask you a few questions to better understand your operation"*
- *"That's a common pain point I see with seasonal businesses"*

## 🚀 Core Features

### 1. **Intelligent Pain Point Detection**
- Automatically identifies business challenges from natural conversation
- Recognizes patterns across multiple categories:
  - Seasonal fluctuations
  - Staff scheduling issues
  - Revenue optimization needs
  - Operational inefficiencies
  - Digital transformation requirements
  - Customer experience challenges

### 2. **Smart Product Matching**
- Maps detected pain points to relevant Access Group solutions
- Uses comprehensive product database with 180+ offerings
- Provides specific recommendations, not generic bundles
- Explains why each product fits the customer's needs

### 3. **Visual Flight Path Progress**
The bot guides customers through a structured discovery journey:

1. **Discovery** - Understanding the business and initial challenges
2. **Understanding** - Deep dive into specific pain points
3. **Solution Design** - Mapping needs to products
4. **Implementation Planning** - Creating actionable next steps

### 4. **Professional Chat Interface**
- Clean, modern design with Access Group branding
- Real-time conversation tracking
- Visual progress indicators
- Mobile-responsive design
- Professional presentation suitable for executive demos

### 5. **Conversation Intelligence**
- Tracks all discovered pain points
- Maintains conversation history
- Generates shareable summaries for account managers
- Provides insights into customer needs and preferences

## 🏗️ Technical Architecture

### Backend (FastAPI)
- **AI Integration**: Anthropic Claude API (claude-3-5-sonnet-20241022)
- **Product Matching**: Intelligent algorithm for pain point detection
- **Conversation Management**: Stateful chat handling with history
- **RESTful API**: Clean endpoints for frontend integration

### Frontend (React + TypeScript)
- **Modern Stack**: Vite + React + TypeScript + Tailwind CSS
- **Component Architecture**: Modular, reusable components
- **Real-time Updates**: Live conversation and progress tracking
- **Professional UI**: shadcn/ui components with Access Group styling

### Data Processing
- **Product Database**: Extracted from Access Group's master framework
- **Pain Point Mapping**: Keyword-based detection with contextual understanding
- **Challenge Categories**: Structured approach to business problem identification

## 🎪 Demo Scenarios

The bot is designed to handle various business scenarios:

### Restaurant Owner
**Input**: *"Summer is absolutely madness while winter is dead"*
**Bot Response**: Recognizes seasonal fluctuation challenges, asks about staffing, bookings, and revenue management

### HR Manager  
**Input**: *"Staff scheduling is a nightmare with holiday requests"*
**Bot Response**: Identifies workforce management pain points, explores scheduling complexity

### Business Owner
**Input**: *"I need to increase booking revenue by 20%"*
**Bot Response**: Focuses on revenue optimization, explores current booking processes

### Traditional Operations
**Input**: *"We use paper menus and handwritten orders"*
**Bot Response**: Recognizes digital transformation opportunity, explores operational efficiency

## 🌐 Live Deployment

- **Frontend**: https://ai-discovery-bot-au2m09sv.devinapps.com/
- **Backend API**: https://app-pozmrqgk.fly.dev/
- **Status**: Production-ready for executive demonstrations

## 📊 Business Value

### For Access Group:
- **Improved Lead Qualification**: Better understanding of customer needs
- **Increased Conversion**: Tailored recommendations vs. generic pitches
- **Scalable Consultation**: AI handles initial discovery at scale
- **Data Insights**: Analytics on common pain points and product demand

### For Customers:
- **Personalized Experience**: Solutions matched to specific needs
- **Expert Guidance**: Industry knowledge without sales pressure
- **Clear Path Forward**: Structured approach to problem-solving
- **Time Efficiency**: Faster discovery process than traditional sales calls

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.12+ (for backend)
- Poetry (Python package manager)
- Anthropic API key

### Backend Setup
```bash
cd listen-backend
poetry install
cp .env.example .env  # Add your Anthropic API key
poetry run fastapi dev app/main.py
```

### Frontend Setup
```bash
cd listen-frontend
npm install
cp .env.example .env  # Configure backend URL
npm run dev
```

### Environment Variables
- `ANTHROPIC_API_KEY`: Your Anthropic Claude API key
- `VITE_API_URL`: Backend API URL (for frontend)

## 📈 Usage Analytics

The bot tracks key metrics:
- **Conversation Length**: Number of messages exchanged
- **Pain Points Discovered**: Categories and frequency
- **Product Recommendations**: Which solutions are suggested most
- **Journey Progress**: How far customers advance through the flight path

## 🔮 Future Enhancements

Potential improvements and extensions:
- **Multi-language Support**: Conversations in different languages
- **Voice Integration**: Audio-based interactions
- **CRM Integration**: Direct connection to Access Group's sales systems
- **Advanced Analytics**: Deeper insights into customer behavior
- **Industry Specialization**: Tailored experiences for specific sectors

## 👥 Team & Support

**Developed by**: Devin AI for Access Group  
**Requested by**: Lee Grieve (lee.grieve@theaccessgroup.com)  
**Session**: [Devin Development Session](https://app.devin.ai/sessions/b2436ad0af1f4b26ae5a0c935d5a43f3)

---

**Ready for executive demonstrations and production deployment!** 🎯
