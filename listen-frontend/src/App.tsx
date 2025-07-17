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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="flex-1 flex flex-col">
        <header className="evo-gradient-bg border-b border-evo-red-600 px-6 py-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <img 
              src="/accessevo.png" 
              alt="Access Group" 
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-sm">Project LISTEN</h1>
              <p className="text-sm text-white/90 font-medium">AI Discovery Bot powered by Access EVO</p>
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
