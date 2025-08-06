import { useState, useCallback } from 'react'
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
  budgetAllocations?: { [key: string]: number }
}

function App() {
  const [conversationData, setConversationData] = useState<ConversationData>(() => {
    const saved = localStorage.getItem('projectlisten-conversation')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        return parsed
      } catch (e) {
        console.error('Error loading saved conversation:', e)
      }
    }
    return {
      conversationId: null,
      messages: [],
      discoveredPainPoints: [],
      recommendedProducts: []
    }
  })
  const [budgetAllocationCompleted, setBudgetAllocationCompleted] = useState(false)
  const [restartHandler, setRestartHandler] = useState<(() => void) | null>(null)

  const updateConversationData = useCallback((data: Partial<ConversationData>) => {
    setConversationData(prev => {
      const updated = { ...prev, ...data }
      localStorage.setItem('projectlisten-conversation', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <header className="evo-gradient-bg border-b border-evo-red-600 px-6 py-4 shadow-lg flex-shrink-0">
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
      
      <main className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0">
          <ChatInterface 
            conversationData={conversationData}
            updateConversationData={updateConversationData}
            onBudgetAllocationComplete={() => setBudgetAllocationCompleted(true)}
            onSetRestartHandler={setRestartHandler}
          />
        </div>
        <div className="w-80 border-l border-gray-200 flex-shrink-0">
          <Sidebar 
            conversationData={conversationData} 
            budgetAllocationCompleted={budgetAllocationCompleted}
            onRestartConversation={restartHandler || undefined}
          />
        </div>
      </main>
    </div>
  )
}

export default App
