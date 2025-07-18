import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BudgetAllocation from './BudgetAllocation'
import peerInsightsData from '../data/peerInsights.json'

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

interface GoalOption {
  id: string
  title: string
  description: string
}

const ChatInterface = ({ conversationData, updateConversationData }: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [showPeerInsights, setShowPeerInsights] = useState(false)
  const [showGoalSelection, setShowGoalSelection] = useState(false)
  const [showBudgetAllocation, setShowBudgetAllocation] = useState(false)
  const [budgetAllocationCompleted, setBudgetAllocationCompleted] = useState(false)
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

  const goalOptions: GoalOption[] = [
    {
      id: 'grow-revenue',
      title: 'Grow Revenue',
      description: 'Increase sales, optimize pricing, and boost profitability'
    },
    {
      id: 'cut-costs',
      title: 'Cut Costs',
      description: 'Reduce expenses, improve efficiency, and streamline operations'
    },
    {
      id: 'enhance-experience',
      title: 'Enhance Experience',
      description: 'Improve customer satisfaction and service quality'
    },
    {
      id: 'streamline-operations',
      title: 'Streamline Operations',
      description: 'Automate processes, reduce manual work, and increase productivity'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationData.messages])

  useEffect(() => {
    const messageCount = conversationData.messages.filter(m => m.role === 'user').length
    const painPointCount = conversationData.discoveredPainPoints.length
    
    if (messageCount >= 3 && 
        painPointCount >= 2 && 
        !showBudgetAllocation && 
        !budgetAllocationCompleted &&
        conversationData.messages.length > 0) {
      setShowBudgetAllocation(true)
    }
  }, [conversationData.messages, conversationData.discoveredPainPoints, showBudgetAllocation, budgetAllocationCompleted])

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId)
    setShowPeerInsights(true)
  }

  const handleGoalSelect = (goalId: string) => {
    setShowGoalSelection(false)
    const selectedOption = industryOptions.find(option => option.id === selectedIndustry)
    const selectedGoalOption = goalOptions.find(option => option.id === goalId)
    if (selectedOption && selectedGoalOption) {
      const industryMessage = `I work in ${selectedOption.title.toLowerCase()} and my primary goal is to ${selectedGoalOption.title.toLowerCase()}. I'd like to discuss my business challenges and explore solutions.`
      setInputMessage(industryMessage)
      setTimeout(() => {
        sendMessage(industryMessage)
      }, 100)
    }
  }

  const transformPainPointsForBudget = (painPoints: string[]): string[] => {
    const painPointMap: { [key: string]: string } = {
      'seasonal_fluctuations': 'Managing Seasonal Business Fluctuations',
      'booking_management': 'Booking & Reservation Management',
      'revenue_optimization': 'Revenue Growth & Optimization',
      'staff_scheduling': 'Staff Scheduling & Management',
      'operational_efficiency': 'Operational Efficiency & Automation',
      'customer_experience': 'Customer Experience Enhancement',
      'data_intelligence': 'Data Analytics & Business Intelligence',
      'digital_transformation': 'Digital Transformation & Modernization'
    }
    
    return painPoints.map(point => painPointMap[point] || point.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
  }

  const handleBudgetAllocationSubmit = (allocations: { [key: string]: number }) => {
    setShowBudgetAllocation(false)
    setBudgetAllocationCompleted(true)
    
    const sortedAllocations = Object.entries(allocations)
      .filter(([_, amount]) => amount > 0)
      .sort(([_, a], [__, b]) => b - a)
    
    const topPriorities = sortedAllocations.slice(0, 3)
    
    const conversationText = conversationData.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ')
    
    const extractSpecificROI = (challengeType: string) => {
      const noShowMatch = conversationText.match(/£(\d+).*(?:no-show|weekend|week)/i)
      const wageMatch = conversationText.match(/(\d+)%.*(?:over budget|wage|labor|staff cost)/i)
      const wifiMatch = conversationText.match(/£(\d+).*(?:month|wifi|waste)/i)
      
      if (challengeType.includes('Revenue') || challengeType.includes('Booking')) {
        if (noShowMatch) {
          const weeklyLoss = parseInt(noShowMatch[1])
          const annualLoss = weeklyLoss * 52
          const recoveredAmount = Math.round(annualLoss * 0.7) // 70% reduction
          const monthlyImpact = Math.round(recoveredAmount / 12)
          return `Your £${weeklyLoss} weekly no-show losses = £${annualLoss.toLocaleString()}/year\n• Reducing no-shows by 70% = £${recoveredAmount.toLocaleString()} recovered annually\n• Monthly impact: £${monthlyImpact.toLocaleString()} in recovered revenue`
        }
        return 'Reduce no-shows and maximize table turnover with measurable revenue recovery'
      }
      
      if (challengeType.includes('Staff') || challengeType.includes('Operational')) {
        if (wageMatch) {
          const overBudgetPercent = parseInt(wageMatch[1])
          const monthlyWages = 8000
          const annualWages = monthlyWages * 12
          const currentOverspend = Math.round(annualWages * (overBudgetPercent / 100))
          const savings = Math.round(currentOverspend * 0.8) // 80% reduction in overspend
          const monthlySavings = Math.round(savings / 12)
          return `Your ${overBudgetPercent}% wage overspend = £${currentOverspend.toLocaleString()}/year excess\n• Reducing overspend by 80% = £${savings.toLocaleString()} saved annually\n• Monthly savings: £${monthlySavings.toLocaleString()} in labor cost reduction`
        }
        return 'Streamline operations and reduce manual scheduling overhead with measurable cost savings'
      }
      
      if (challengeType.includes('Customer') || challengeType.includes('Digital')) {
        if (wifiMatch) {
          const monthlyWaste = parseInt(wifiMatch[1])
          const annualWaste = monthlyWaste * 12
          const savings = Math.round(annualWaste * 0.9) // 90% efficiency improvement
          const monthlySavings = Math.round(savings / 12)
          return `Your £${monthlyWaste}/month WiFi waste = £${annualWaste.toLocaleString()}/year\n• Optimizing WiFi efficiency by 90% = £${savings.toLocaleString()} saved annually\n• Monthly savings: £${monthlySavings.toLocaleString()} in operational efficiency`
        }
        return 'Enhanced customer engagement with measurable satisfaction improvements'
      }
      
      return 'Measurable business impact with specific ROI tracking'
    }
    
    let recommendationsContent = `Thank you for prioritizing your challenges. Based on your budget allocation, I can see what matters most to your business.\n\n**Your Investment Priorities:**\n`
    
    topPriorities.forEach(([challenge, amount], index) => {
      recommendationsContent += `${index + 1}. ${challenge}: £${amount}\n`
    })
    
    const highestPriority = topPriorities[0]
    if (highestPriority) {
      recommendationsContent += `\nBased on your £${highestPriority[1]} investment priority in ${highestPriority[0]}, we're focusing first on the area that matters most to you.\n`
    }
    
    recommendationsContent += `\n**Recommended Flight Path:**\n\nBased on your priorities, here's your personalized implementation roadmap:\n\n`
    
    const challengeToSolution: { [key: string]: { title: string; product: string; description: string; benefits: string; roi: string } } = {
      'Revenue': {
        title: 'Revenue Optimization',
        product: 'Collins Access Group',
        description: 'Advanced booking and reservation management',
        benefits: 'Reduce no-shows and maximize table turnover',
        roi: extractSpecificROI('Revenue')
      },
      'Booking': {
        title: 'Revenue Optimization', 
        product: 'Collins Access Group',
        description: 'Advanced booking and reservation management',
        benefits: 'Reduce no-shows and maximize table turnover',
        roi: extractSpecificROI('Booking')
      },
      'Staff': {
        title: 'Operational Excellence',
        product: 'RotaReady',
        description: 'Intelligent staff scheduling and management',
        benefits: 'Streamline operations and reduce manual processes',
        roi: extractSpecificROI('Staff')
      },
      'Operational': {
        title: 'Operational Excellence',
        product: 'RotaReady', 
        description: 'Intelligent staff scheduling and management',
        benefits: 'Streamline operations and reduce manual processes',
        roi: extractSpecificROI('Operational')
      },
      'Customer': {
        title: 'Customer Experience Enhancement',
        product: 'Guest WiFi',
        description: 'Enhanced customer engagement platform',
        benefits: 'Digital transformation and modernization',
        roi: extractSpecificROI('Customer')
      },
      'Digital': {
        title: 'Customer Experience Enhancement',
        product: 'Guest WiFi',
        description: 'Enhanced customer engagement platform', 
        benefits: 'Digital transformation and modernization',
        roi: extractSpecificROI('Digital')
      }
    }
    
    const usedSolutions = new Set()
    let phaseNumber = 1
    
    topPriorities.forEach(([challenge, amount]) => {
      const solutionKey = Object.keys(challengeToSolution).find(key => challenge.includes(key))
      if (solutionKey) {
        const solution = challengeToSolution[solutionKey]
        const solutionId = `${solution.product}-${solution.title}`
        
        if (!usedSolutions.has(solutionId)) {
          usedSolutions.add(solutionId)
          const timeframe = phaseNumber === 1 ? 'Months 1-3' : phaseNumber === 2 ? 'Months 2-4' : 'Months 3-6'
          const priorityLevel = phaseNumber === 1 ? 'highest concern' : phaseNumber === 2 ? 'second priority' : 'supporting improvement'
          
          recommendationsContent += `**Phase ${phaseNumber} (£${amount} priority): ${solution.title} (${timeframe})**\n• ${solution.product} - ${solution.description}\n• ${solution.benefits} - addressing your ${priorityLevel}\n• ${solution.roi}\n\n`
          phaseNumber++
        }
      }
    })
    
    recommendationsContent += `**Next Steps:**\n• Schedule a personalized demo of your priority solutions\n• Receive detailed implementation timeline\n• Connect with our specialist team\n• Download your complete discovery report\n\nWould you like to schedule a demo or discuss any of these recommendations in more detail?`
    
    const budgetMessage: Message = {
      role: 'assistant',
      content: recommendationsContent,
      timestamp: new Date()
    }
    
    updateConversationData({
      messages: [...conversationData.messages, budgetMessage]
    })
  }

  const sendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage
    if (!messageToSend.trim() || isLoading || showBudgetAllocation || budgetAllocationCompleted) return

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

        {conversationData.messages.length === 0 && selectedIndustry && showPeerInsights && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img 
                src="/csai.png" 
                alt="CS AI" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Here's what {peerInsightsData[selectedIndustry as keyof typeof peerInsightsData]?.title.toLowerCase()} like yours are focusing on:
            </h2>
            
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <ul className="space-y-3 text-left">
                  {peerInsightsData[selectedIndustry as keyof typeof peerInsightsData]?.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-evo-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setShowPeerInsights(false)
                  setShowGoalSelection(true)
                }}
                className="evo-button px-8 py-3 text-lg"
              >
                Let's explore your specific challenges
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 max-w-lg mx-auto">
              <p>Data based on current UK hospitality statistics from Toast UK Restaurant Statistics, ResDiary Hospitality Report 2024, and UK Hospitality Association research.</p>
            </div>
          </div>
        )}

        {conversationData.messages.length === 0 && selectedIndustry && showGoalSelection && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img 
                src="/csai.png" 
                alt="CS AI" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What's your primary goal for your {industryOptions.find(i => i.id === selectedIndustry)?.title.toLowerCase()} business?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              This will help me provide more targeted recommendations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {goalOptions.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-evo-red-500 hover:shadow-lg transition-all duration-200 group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-evo-red-600">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {goal.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {conversationData.messages.length === 0 && selectedIndustry && !showPeerInsights && !showGoalSelection && (
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

        {showBudgetAllocation && (
          <div className="my-8">
            <BudgetAllocation
              painPoints={transformPainPointsForBudget(conversationData.discoveredPainPoints)}
              onSubmit={handleBudgetAllocationSubmit}
            />
          </div>
        )}

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
        {showBudgetAllocation ? (
          <div className="text-center py-2">
            <p className="text-sm text-gray-600">
              Please complete your budget allocation above to continue the conversation.
            </p>
          </div>
        ) : budgetAllocationCompleted ? (
          <div className="text-center py-2">
            <p className="text-sm text-gray-600">
              Thank you for completing your budget allocation. Your personalized recommendations are shown above.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default ChatInterface
