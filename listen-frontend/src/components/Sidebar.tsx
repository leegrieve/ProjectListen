import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Package, TrendingUp, FileText, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface BusinessSummary {
  conversation_id: string
  customer_business_summary: {
    total_pain_points: number
    conversation_length: number
    discovery_completeness: string
  }
  identified_pain_points: Array<{
    pain_point: string
    category: string
    solutions: Array<{
      product: string
      how_it_helps: string
      why_suggested: string
      business_impact: string
      priority: string
    }>
  }>
  recommended_flight_path: {
    "Phase 1 - Foundation": Array<{
      system: string
      addresses: string
      business_value: string
      implementation_priority: string
    }>
    "Phase 2 - Optimization": Array<any>
    "Phase 3 - Enhancement": Array<any>
  }
  next_steps: string[]
  generated_at: string
}

interface ConversationData {
  conversationId: string | null
  messages: any[]
  discoveredPainPoints: string[]
  recommendedProducts: string[]
}

interface SidebarProps {
  conversationData: ConversationData
  budgetAllocationCompleted?: boolean
}

const Sidebar = ({ conversationData, budgetAllocationCompleted = false }: SidebarProps) => {
  const [businessSummary, setBusinessSummary] = useState<BusinessSummary | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const formatPainPoint = (painPoint: string) => {
    return painPoint.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const fetchBusinessSummary = async () => {
    if (!conversationData.conversationId || conversationData.discoveredPainPoints.length === 0) {
      return
    }

    setIsLoadingSummary(true)
    setSummaryError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationData.conversationId}/business-summary`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch business summary')
      }

      const data = await response.json()
      setBusinessSummary(data)
    } catch (error) {
      console.error('Error fetching business summary:', error)
      setSummaryError('Failed to generate business summary')
    } finally {
      setIsLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (conversationData.conversationId && conversationData.discoveredPainPoints.length > 0) {
      fetchBusinessSummary()
    }
  }, [conversationData.conversationId, conversationData.discoveredPainPoints.length])

  const getFlightPathStage = () => {
    if (conversationData.recommendedProducts.length > 0) return 4
    if (conversationData.discoveredPainPoints.length > 2) return 3
    if (conversationData.discoveredPainPoints.length > 0) return 2
    if (conversationData.messages.length > 0) return 1
    return 0
  }

  const flightPathStages = [
    "Discovery",
    "Understanding", 
    "Solution Design",
    "Implementation Planning"
  ]

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4 space-y-4 overflow-y-auto flex flex-col">
      <Card className="evo-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-evo-red-500" />
            <span>Flight Path Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            {flightPathStages.map((stage, index) => {
              const currentStage = getFlightPathStage()
              const isActive = index < currentStage
              const isCurrent = index === currentStage - 1
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shadow-sm ${
                    isActive 
                      ? 'bg-evo-red-500 text-white shadow-evo-red-200' 
                      : isCurrent
                      ? 'bg-evo-red-100 text-evo-red-600 border-2 border-evo-red-500'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      isActive || isCurrent ? 'text-evo-red-600' : 'text-gray-500'
                    }`}>
                      {stage}
                    </div>
                  </div>
                  {index < flightPathStages.length - 1 && (
                    <div className={`w-4 h-0.5 rounded-full ${
                      isActive ? 'bg-evo-red-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="text-xs text-gray-500">
            Your personalized journey to achieving your business goals
          </div>
        </CardContent>
      </Card>

      {conversationData.discoveredPainPoints.length > 0 && (
        <Card className="evo-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Target className="w-4 h-4 text-evo-red-500" />
              <span>Discovered Pain Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {conversationData.discoveredPainPoints.map((painPoint, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {formatPainPoint(painPoint)}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Key challenges we've identified in your business
            </div>
          </CardContent>
        </Card>
      )}

      {budgetAllocationCompleted && conversationData.recommendedProducts.length > 0 && (
        <Card className="evo-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Package className="w-4 h-4 text-evo-red-500" />
              <span>Recommended Solutions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              {conversationData.recommendedProducts.map((product, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-evo-red-50 to-evo-teal-50 rounded-lg border border-evo-red-100 shadow-sm">
                  <div className="font-medium text-evo-red-900 text-sm">{product}</div>
                  <div className="text-xs text-evo-red-700 mt-1 font-medium">
                    Access EVO Solution
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Products selected specifically for your needs - not a generic bundle
            </div>
          </CardContent>
        </Card>
      )}

      {conversationData.messages.length > 0 && (
        <Card className="evo-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-gray-600">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Messages:</span>
                <span className="font-medium">{conversationData.messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pain Points:</span>
                <span className="font-medium">{conversationData.discoveredPainPoints.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Solutions:</span>
                <span className="font-medium">{conversationData.recommendedProducts.length}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              This summary can be shared with your Access Group account manager
            </div>
          </CardContent>
        </Card>
      )}

      {budgetAllocationCompleted && businessSummary && (
        <Card className="evo-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4 text-evo-red-500" />
              <span>Business Takeaway</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your Priorities
              </h3>
              
              {businessSummary.identified_pain_points.map((painPoint, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-evo-red-900">
                      {painPoint.pain_point}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {painPoint.solutions.slice(0, 2).map((solution, sIndex) => (
                      <div key={sIndex} className="p-3 bg-evo-teal-50 rounded-lg border border-evo-teal-200">
                        <div className="flex items-start space-x-2 mb-2">
                          <span className="text-evo-teal-600 font-bold text-sm mt-0.5">✔︎</span>
                          <div className="flex-1">
                            <div className="font-medium text-xs text-gray-800">
                              {solution.product}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {solution.how_it_helps.replace(/"/g, '')}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-evo-teal-700 mt-2 italic">
                          {solution.why_suggested}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-evo-teal-600 font-medium">
                            {solution.business_impact}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            solution.priority === 'High' 
                              ? 'bg-evo-red-100 text-evo-red-700'
                              : solution.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {solution.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Custom Flight Path
              </h3>
              
              {Object.entries(businessSummary.recommended_flight_path).map(([phase, items]) => (
                items.length > 0 && (
                  <Card key={phase} className="border-l-4 border-l-evo-teal-500">
                    <CardHeader className="bg-gray-50 pb-3">
                      <CardTitle className="text-lg font-bold text-evo-red-700 uppercase tracking-wide">
                        {phase.replace(/_/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {items.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <span className="text-evo-teal-600 font-bold text-sm mt-0.5">✔︎</span>
                            <div className="flex-1">
                              <div className="font-medium text-xs text-gray-800">
                                {item.system}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Pain Point:</span> {item.addresses}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">Solution:</span> {item.business_value.replace(/"/g, '')}
                              </div>
                              <div className="text-xs text-evo-teal-600 font-medium mt-1">
                                {item.implementation_priority}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Next Steps
              </h3>
              <Card className="border border-gray-200">
                <CardContent className="p-4 space-y-3">
                  {businessSummary.next_steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-evo-teal-600 font-bold text-sm mt-0.5 min-w-[20px]">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <Button
                onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationData.conversationId}/business-summary`, '_blank')}
                className="w-full text-xs py-2 bg-evo-teal-500 hover:bg-evo-teal-600 text-white"
                size="sm"
              >
                <Download className="w-3 h-3 mr-2" />
                Export Full Business Summary
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              Generated for Access Group account manager review
            </div>
          </CardContent>
        </Card>
      )}

      {budgetAllocationCompleted && isLoadingSummary && conversationData.discoveredPainPoints.length > 0 && (
        <Card className="evo-card">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-500">
              Generating business takeaway...
            </div>
          </CardContent>
        </Card>
      )}

      {budgetAllocationCompleted && summaryError && (
        <Card className="evo-card">
          <CardContent className="p-4">
            <div className="text-xs text-red-600">
              {summaryError}
            </div>
            <Button
              onClick={fetchBusinessSummary}
              className="w-full mt-2 text-xs py-1"
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 text-center pt-4">
        <p>Powered by Access Group</p>
        <p className="text-evo-red-600 font-bold">Project LISTEN</p>
      </div>
    </div>
  )
}

export default Sidebar
