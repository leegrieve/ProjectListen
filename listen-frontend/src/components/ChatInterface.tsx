import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ConversationData {
  conversationId: string | null
  messages: Message[]
  discoveredPainPoints: string[]
  recommendedProducts: string[]
}

interface ChatInterfaceProps {
  conversationData: ConversationData
  updateConversationData: (data: Partial<ConversationData>) => void
}

interface IndustryOption {
  id: string
  title: string
  description: string
}

const ChatInterface = ({ conversationData, updateConversationData }: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const industryOptions: IndustryOption[] = [
    {
      id: 'restaurants-bars',
      title: 'Restaurants & Bars',
      description: 'Full-service dining, bars, and hospitality venues'
    },
    {
      id: 'hotels-accommodation',
      title: 'Hotels & Accommodation',
      description: 'Hotels, B&Bs, and accommodation providers'
    },
    {
      id: 'cafes-quick-service',
      title: 'Cafes & Quick Service',
      description: 'Coffee shops, fast food, and quick-service restaurants'
    },
    {
      id: 'entertainment-venues',
      title: 'Entertainment Venues',
      description: 'Cinemas, theaters, clubs, and entertainment facilities'
    },
    {
      id: 'multi-site-operations',
      title: 'Multi-site Operations',
      description: 'Chains, franchises, and multi-location businesses'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationData.messages])

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId)
    const selectedOption = industryOptions.find(option => option.id === industryId)
    if (selectedOption) {
      const industryMessage = `I work in ${selectedOption.title.toLowerCase()}. I'd like to discuss my business challenges and explore solutions.`
      setInputMessage(industryMessage)
      setTimeout(() => {
        sendMessage(industryMessage)
      }, 100)
    }
  }

  const sendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    updateConversationData({
      messages: [...conversationData.messages, userMessage]
    })

    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversation_id: conversationData.conversationId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      updateConversationData({
        conversationId: data.conversation_id,
        messages: [...conversationData.messages, userMessage, assistantMessage],
        discoveredPainPoints: data.discovered_pain_points,
        recommendedProducts: data.recommended_products
      })
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      updateConversationData({
        messages: [...conversationData.messages, userMessage, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-evo-teal-50 to-evo-red-50 border-b border-evo-teal-200 p-4 flex-shrink-0">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-evo-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <span className="text-white font-bold text-xs">i</span>
          </div>
          <p className="text-sm text-gray-800 font-medium">
            I'm your Access EVO consultant. Tell me about your business challenges and I'll help build a custom solution - no pushy sales, just understanding your needs.
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {conversationData.messages.length === 0 && !selectedIndustry && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img 
                src="/csai.png" 
                alt="CS AI" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Let's design your perfect solution</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              First, tell us about your business
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {industryOptions.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => handleIndustrySelect(industry.id)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-evo-red-500 hover:shadow-lg transition-all duration-200 group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-evo-red-600">
                    {industry.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {industry.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>Select your industry to get started with personalized recommendations</p>
            </div>
          </div>
        )}

        {conversationData.messages.length === 0 && selectedIndustry && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mx-auto mb-4">
              <img 
                src="/csai.png" 
                alt="CS AI" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Perfect! Let's explore your {industryOptions.find(i => i.id === selectedIndustry)?.title.toLowerCase()} business</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm your consultative industry expert. Tell me about your specific challenges, 
              and I'll help you discover the right Access Group solutions.
            </p>
          </div>
        )}

        {conversationData.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-evo-red-500 text-white shadow-evo-red-200'
                  : 'bg-white border border-gray-200 text-gray-900 hover:shadow-md transition-shadow'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-evo-red-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-gray-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your business challenges..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="evo-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
