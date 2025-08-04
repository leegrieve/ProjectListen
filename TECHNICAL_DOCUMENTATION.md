# Technical Documentation - Project LISTEN

## 🏗️ System Architecture

### Overview
Project LISTEN is a full-stack web application consisting of a FastAPI backend with AI integration and a React frontend with professional UI components.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  Anthropic API  │
│                 │    │                 │    │                 │
│  - Chat UI      │◄──►│  - Conversation │◄──►│  - Claude AI    │
│  - Progress     │    │  - Product      │    │  - NLP          │
│  - Branding     │    │  - Pain Points  │    │  - Responses    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Backend Architecture (FastAPI)

### Core Components

#### 1. Main Application (`app/main.py`)
```python
# FastAPI application with CORS configuration
app = FastAPI(title="Project LISTEN API")

# Endpoints:
# POST /api/chat - Main conversation endpoint
# GET /api/history/{conversation_id} - Conversation history
# GET /api/recommendations/{conversation_id} - Product recommendations
# GET /api/summary/{conversation_id} - Conversation summary
```

#### 2. Data Models (`app/models.py`)
```python
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    discovered_pain_points: List[str]
    recommended_products: List[str]
```

#### 3. Conversation Service (`app/services/conversation_service.py`)
**Purpose**: Manages chat state and AI integration

**Key Methods**:
- `create_conversation()`: Initialize new conversation
- `process_message()`: Handle user input and generate AI response
- `get_conversation_history()`: Retrieve chat history
- `get_conversation_summary()`: Generate conversation insights

**AI Integration**:
```python
# Claude API configuration
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
model = "claude-3-5-sonnet-20241022"

# System prompt defines the consultative persona
system_prompt = """You are a consultative industry expert for Access Group..."""
```

#### 4. Product Matcher (`app/services/product_matcher.py`)
**Purpose**: Intelligent pain point detection and product recommendations

**Pain Point Categories**:
- `seasonal_fluctuations`: Summer/winter business variations
- `booking_management`: Reservation and booking challenges
- `revenue_optimization`: Income and profit improvement needs
- `staff_scheduling`: Workforce management issues
- `operational_efficiency`: Process improvement opportunities
- `customer_experience`: Service quality challenges
- `data_intelligence`: Analytics and reporting needs
- `digital_transformation`: Technology modernization

**Algorithm**:
```python
def detect_pain_points(self, conversation_text: str) -> List[str]:
    """
    1. Convert conversation to lowercase
    2. Check for keyword matches in each category
    3. Return unique pain point categories found
    """
    
def get_product_recommendations(self, pain_points: List[str]) -> List[str]:
    """
    1. Find challenges matching pain points
    2. Extract associated Access Group products
    3. Return unique product recommendations
    """
```

### Data Processing

#### Product Data Extraction (`extract_product_data.py`)
Processes the Excel file containing Access Group's product mappings:

```python
# Extracts data from Excel sheets:
# - Master Outcome Framework
# - Feature-to-Outcome Mapping

# Generates challenges_data.json with:
# - Challenge categories
# - Pain point descriptions
# - Product mappings
# - Success metrics
```

#### Challenge Data Structure (`challenges_data.json`)
```json
{
  "challenge_id": "CH001",
  "challenge_category": "Seasonal Fluctuations",
  "specific_challenge": "Summer rush management",
  "customer_pain_point": "Summer is madness, can't handle the volume",
  "desired_outcome": "Smooth operations during peak season",
  "collins_feature(s)": "Advanced booking management",
  "success_metrics": "50% reduction in booking conflicts",
  "product": "Collins",
  "industry": "Hospitality"
}
```

## 🎨 Frontend Architecture (React)

### Component Structure

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── Sidebar.tsx         # Progress and summary display
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── App.tsx                 # Main application component
```

#### 1. App Component (`App.tsx`)
**Purpose**: Main application layout and state management

```typescript
interface ConversationData {
  conversationId: string | null
  messages: Message[]
  discoveredPainPoints: string[]
  recommendedProducts: string[]
}

// Manages global conversation state
// Renders header with Access Group branding
// Coordinates ChatInterface and Sidebar components
```

#### 2. Chat Interface (`ChatInterface.tsx`)
**Purpose**: Handles user input and message display

**Features**:
- Real-time message exchange
- Loading states during AI processing
- Error handling for failed requests
- Responsive message bubbles
- Info box with consultant introduction

**API Integration**:
```typescript
const sendMessage = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: inputMessage,
      conversation_id: conversationData.conversationId
    })
  })
  
  const data = await response.json()
  // Update conversation state with response
}
```

#### 3. Sidebar Component (`Sidebar.tsx`)
**Purpose**: Visual progress tracking and conversation insights

**Flight Path Visualization**:
```typescript
const flightPathStages = [
  "Discovery",
  "Understanding", 
  "Solution Design",
  "Implementation Planning"
]

// Visual stage indicators with:
// - Completed stages: red background
// - Current stage: red border
// - Future stages: gray background
```

**Dynamic Content Sections**:
- Flight Path Progress with visual stages
- Discovered Pain Points as badges
- Recommended Solutions with product details
- Conversation Summary with metrics

### Styling & Design

#### Tailwind CSS Configuration
```javascript
// Custom Access Group color scheme
colors: {
  red: {
    600: '#ED1C24',  // Primary Access Group red
    700: '#D1181E',  // Darker red for hover states
  }
}
```

#### Component Library
- **shadcn/ui**: Pre-built, accessible components
- **Lucide React**: Professional icon set
- **Custom styling**: Access Group brand compliance

## 🔐 Security & Environment

### Environment Variables
```bash
# Backend (.env)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Frontend (.env)
VITE_API_URL=http://localhost:8000  # Development
VITE_API_URL=https://app-jeunfzgn.fly.dev  # Production
```

### CORS Configuration
```python
# Allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Deployment Architecture

### Backend Deployment (Fly.io)
```toml
# fly.toml configuration
[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8000"

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"
```

### Frontend Deployment (Devin Apps)
```bash
# Build process
npm run build  # Creates optimized dist/ folder
# Deploy dist/ folder to CDN
```

### Production URLs
- **Frontend**: https://ai-discovery-bot-au2m09sv.devinapps.com/
- **Backend**: https://app-jeunfzgn.fly.dev/

## 📊 Performance Considerations

### Backend Optimization
- **In-memory storage**: Fast conversation access (suitable for prototype)
- **Async operations**: Non-blocking API calls to Anthropic
- **Error handling**: Graceful degradation on AI service failures

### Frontend Optimization
- **Code splitting**: Lazy loading of components
- **Optimized builds**: Vite bundling with tree shaking
- **Responsive design**: Mobile-first approach

### Scalability Notes
- **Database**: Currently in-memory, can be upgraded to PostgreSQL
- **Caching**: Add Redis for conversation state persistence
- **Load balancing**: Horizontal scaling for high traffic

## 🧪 Testing Strategy

### Backend Testing
```python
# Unit tests for core services
def test_pain_point_detection():
    matcher = ProductMatcher()
    text = "Summer is madness, winter is dead"
    points = matcher.detect_pain_points(text)
    assert "seasonal_fluctuations" in points

def test_product_recommendations():
    matcher = ProductMatcher()
    pain_points = ["seasonal_fluctuations"]
    products = matcher.get_product_recommendations(pain_points)
    assert len(products) > 0
```

### Frontend Testing
```typescript
// Component testing with React Testing Library
test('renders chat interface', () => {
  render(<ChatInterface conversationData={mockData} />)
  expect(screen.getByPlaceholderText(/tell me about/i)).toBeInTheDocument()
})
```

### Integration Testing
- **API endpoints**: Full request/response cycle testing
- **AI integration**: Mock Anthropic responses for consistent testing
- **UI flows**: End-to-end user journey testing

## 🔧 Development Workflow

### Local Development
```bash
# Start backend
cd listen-backend
poetry run fastapi dev app/main.py  # http://localhost:8000

# Start frontend
cd listen-frontend
npm run dev  # http://localhost:5173
```

### Code Quality
- **TypeScript**: Type safety for frontend
- **Pydantic**: Data validation for backend
- **ESLint**: Code linting for JavaScript/TypeScript
- **Black**: Code formatting for Python

### Git Workflow
- **Feature branches**: `devin/{timestamp}-{feature-name}`
- **Conventional commits**: Clear, descriptive commit messages
- **Pull requests**: Code review and CI/CD integration

## 📈 Monitoring & Analytics

### Application Metrics
- **Conversation volume**: Number of active chats
- **Pain point frequency**: Most common business challenges
- **Product recommendation patterns**: Popular solutions
- **User journey completion**: Flight path progression rates

### Technical Metrics
- **API response times**: Backend performance monitoring
- **Error rates**: Failed requests and AI service issues
- **Frontend performance**: Page load times and user interactions

### Future Monitoring
- **APM integration**: Application Performance Monitoring
- **Log aggregation**: Centralized logging with structured data
- **User analytics**: Detailed user behavior tracking

---

This technical documentation provides a comprehensive overview of Project LISTEN's architecture, implementation details, and operational considerations.
