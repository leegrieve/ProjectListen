import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import './App.css'

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

function App() {
  const [conversationData, setConversationData] = useState<ConversationData>({
    conversationId: null,
    messages: [],
    discoveredPainPoints: [],
    recommendedProducts: []
  })

  const updateConversationData = (data: Partial<ConversationData>) => {
    setConversationData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/accesslogo.jpg" 
              alt="Access Group" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Project LISTEN</h1>
              <p className="text-sm text-gray-600">AI Discovery Bot for Access Group</p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex">
          <div className="flex-1">
            <ChatInterface 
              conversationData={conversationData}
              updateConversationData={updateConversationData}
            />
          </div>
          <div className="w-80 border-l border-gray-200">
            <Sidebar conversationData={conversationData} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
