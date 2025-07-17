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

const ChatInterface = ({ conversationData, updateConversationData }: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationData.messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
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
          message: inputMessage,
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
    <div className="flex flex-col h-full">
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white font-bold text-xs">i</span>
          </div>
          <p className="text-sm text-blue-800">
            I'm your Access Group consultant. Tell me about your business challenges and I'll help build a custom solution - no pushy sales, just understanding your needs.
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversationData.messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Project LISTEN</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm your consultative industry expert. Tell me about your business challenges, 
              and I'll help you discover the right Access Group solutions.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p><strong>Try saying:</strong></p>
              <p>"Summer is absolutely madness while winter is dead"</p>
              <p>"Staff scheduling is a nightmare with holiday requests"</p>
              <p>"I need to increase booking revenue by 20%"</p>
            </div>
          </div>
        )}

        {conversationData.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-red-100' : 'text-gray-500'
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

      <div className="border-t border-gray-200 p-4 bg-white">
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
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
