# API Documentation - Project LISTEN Backend

## 🌐 Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://app-jeunfzgn.fly.dev`

## 📋 API Overview

The Project LISTEN backend provides RESTful endpoints for managing AI-powered conversations, pain point detection, and product recommendations.

### Authentication
Currently, no authentication is required for API access. This is suitable for the prototype/demo phase.

### Content Type
All requests and responses use `application/json` content type.

## 🔗 Endpoints

### 1. Chat Endpoint

#### `POST /api/chat`
Main conversation endpoint for processing user messages and generating AI responses.

**Request Body:**
```json
{
  "message": "string",
  "conversation_id": "string | null"
}
```

**Parameters:**
- `message` (required): User's input message
- `conversation_id` (optional): Existing conversation ID, or null for new conversation

**Response:**
```json
{
  "response": "string",
  "conversation_id": "string",
  "discovered_pain_points": ["string"],
  "recommended_products": ["string"]
}
```

**Response Fields:**
- `response`: AI-generated response to the user's message
- `conversation_id`: Unique identifier for the conversation
- `discovered_pain_points`: List of business challenges identified
- `recommended_products`: List of Access Group products recommended

**Example Request:**
```bash
curl -X POST "https://app-jeunfzgn.fly.dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Summer is absolutely madness while winter is dead",
    "conversation_id": null
  }'
```

**Example Response:**
```json
{
  "response": "I completely understand that challenge - seasonal fluctuations are one of the biggest pain points I see in hospitality. Summer being 'madness' while winter is 'dead' creates so many operational headaches...",
  "conversation_id": "conv_1234567890",
  "discovered_pain_points": ["seasonal_fluctuations"],
  "recommended_products": ["Collins", "RotaReady"]
}
```

### 2. Conversation History

#### `GET /api/history/{conversation_id}`
Retrieve the complete message history for a conversation.

**Parameters:**
- `conversation_id` (path): Unique conversation identifier

**Response:**
```json
{
  "conversation_id": "string",
  "messages": [
    {
      "role": "user | assistant",
      "content": "string",
      "timestamp": "2025-07-17T13:45:00Z"
    }
  ],
  "created_at": "2025-07-17T13:45:00Z",
  "updated_at": "2025-07-17T13:45:00Z"
}
```

**Example Request:**
```bash
curl "https://app-jeunfzgn.fly.dev/api/history/conv_1234567890"
```

### 3. Product Recommendations

#### `GET /api/recommendations/{conversation_id}`
Get current product recommendations for a conversation.

**Parameters:**
- `conversation_id` (path): Unique conversation identifier

**Response:**
```json
{
  "conversation_id": "string",
  "discovered_pain_points": ["string"],
  "recommended_products": [
    {
      "product_name": "string",
      "reason": "string",
      "pain_points_addressed": ["string"]
    }
  ]
}
```

**Example Response:**
```json
{
  "conversation_id": "conv_1234567890",
  "discovered_pain_points": ["seasonal_fluctuations", "staff_scheduling"],
  "recommended_products": [
    {
      "product_name": "Collins",
      "reason": "Helps manage booking fluctuations and optimize capacity",
      "pain_points_addressed": ["seasonal_fluctuations"]
    },
    {
      "product_name": "RotaReady",
      "reason": "Streamlines staff scheduling and holiday management",
      "pain_points_addressed": ["staff_scheduling"]
    }
  ]
}
```

### 4. Conversation Summary

#### `GET /api/summary/{conversation_id}`
Generate a summary of the conversation with key metrics and insights.

**Parameters:**
- `conversation_id` (path): Unique conversation identifier

**Response:**
```json
{
  "conversation_id": "string",
  "summary": {
    "total_messages": "number",
    "pain_points_discovered": "number",
    "products_recommended": "number",
    "conversation_stage": "string",
    "key_insights": ["string"]
  },
  "created_at": "2025-07-17T13:45:00Z",
  "last_updated": "2025-07-17T13:45:00Z"
}
```

**Example Response:**
```json
{
  "conversation_id": "conv_1234567890",
  "summary": {
    "total_messages": 8,
    "pain_points_discovered": 3,
    "products_recommended": 2,
    "conversation_stage": "Solution Design",
    "key_insights": [
      "Seasonal business with 3x volume difference between summer and winter",
      "Current manual scheduling causing staff management issues",
      "Looking for integrated solution for bookings and workforce management"
    ]
  },
  "created_at": "2025-07-17T13:45:00Z",
  "last_updated": "2025-07-17T13:45:00Z"
}
```

## 🔍 Pain Point Categories

The system automatically detects the following pain point categories:

| Category | Keywords | Description |
|----------|----------|-------------|
| `seasonal_fluctuations` | summer, winter, seasonal, busy, quiet, madness, dead | Business volume variations by season |
| `booking_management` | booking, reservation, double booking, lost booking, track, channels | Reservation and booking challenges |
| `revenue_optimization` | revenue, no-show, turnover, covers, profit, money, income | Income and profit improvement needs |
| `staff_scheduling` | staff, scheduling, roster, holiday, requests, shifts, rota | Workforce management issues |
| `operational_efficiency` | manual, time, wastage, efficiency, automation, process, paper, handwriting, orders, menu | Process improvement opportunities |
| `customer_experience` | customer, guest, satisfaction, experience, service, complaints | Service quality challenges |
| `data_intelligence` | data, insights, analytics, reporting, forecasting, patterns | Analytics and reporting needs |
| `digital_transformation` | paper, manual, handwritten, diary, digital, modernize, technology | Technology modernization |

## 🚨 Error Handling

### Standard Error Response
```json
{
  "error": "string",
  "message": "string",
  "details": "string"
}
```

### Common Error Codes

#### `400 Bad Request`
- Missing required fields in request body
- Invalid conversation_id format
- Empty message content

#### `404 Not Found`
- Conversation ID not found
- Invalid endpoint

#### `500 Internal Server Error`
- AI service unavailable
- Database connection issues
- Unexpected server errors

**Example Error Response:**
```json
{
  "error": "Bad Request",
  "message": "Message content cannot be empty",
  "details": "The 'message' field must contain at least one character"
}
```

## 🔧 Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider:
- **Per-IP limits**: 100 requests per minute
- **Per-conversation limits**: 50 messages per hour
- **Burst allowance**: 10 requests per 10 seconds

## 📊 Response Times

Typical response times:
- **Chat endpoint**: 2-5 seconds (depends on AI processing)
- **History/Summary endpoints**: < 100ms
- **Recommendations endpoint**: < 50ms

## 🧪 Testing the API

### Using cURL

**Start a new conversation:**
```bash
curl -X POST "https://app-jeunfzgn.fly.dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "We have issues with staff scheduling during busy periods",
    "conversation_id": null
  }'
```

**Continue existing conversation:**
```bash
curl -X POST "https://app-jeunfzgn.fly.dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me more about workforce management solutions",
    "conversation_id": "conv_1234567890"
  }'
```

**Get conversation history:**
```bash
curl "https://app-jeunfzgn.fly.dev/api/history/conv_1234567890"
```

### Using JavaScript/Fetch

```javascript
// Start new conversation
const response = await fetch('https://app-jeunfzgn.fly.dev/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Summer is madness, winter is dead',
    conversation_id: null
  })
});

const data = await response.json();
console.log(data);
```

### Using Python/Requests

```python
import requests

# Start new conversation
response = requests.post(
    'https://app-jeunfzgn.fly.dev/api/chat',
    json={
        'message': 'We need help with revenue optimization',
        'conversation_id': None
    }
)

data = response.json()
print(data)
```

## 🔐 Security Considerations

### Current Implementation
- No authentication required (suitable for demo)
- CORS enabled for all origins
- No sensitive data logging

### Production Recommendations
- Implement API key authentication
- Add rate limiting and request validation
- Configure CORS for specific domains only
- Add request/response logging for monitoring
- Implement conversation data encryption

## 📈 Monitoring & Analytics

### Recommended Metrics to Track
- **Request volume**: Total API calls per endpoint
- **Response times**: Average and 95th percentile latencies
- **Error rates**: 4xx and 5xx response percentages
- **Conversation metrics**: Average length, completion rates
- **Pain point frequency**: Most common business challenges identified

### Health Check Endpoint
Consider adding a health check endpoint for monitoring:

```
GET /health
Response: {"status": "healthy", "timestamp": "2025-07-17T13:45:00Z"}
```

---

This API documentation provides comprehensive information for integrating with the Project LISTEN backend services.
