import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Package, TrendingUp } from 'lucide-react'

interface ConversationData {
  conversationId: string | null
  messages: any[]
  discoveredPainPoints: string[]
  recommendedProducts: string[]
}

interface SidebarProps {
  conversationData: ConversationData
}

const Sidebar = ({ conversationData }: SidebarProps) => {
  const formatPainPoint = (painPoint: string) => {
    return painPoint.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

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
    <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4 space-y-4 overflow-y-auto">
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

      {conversationData.recommendedProducts.length > 0 && (
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

      <div className="text-xs text-gray-500 text-center pt-4">
        <p>Powered by Access Group</p>
        <p className="text-evo-red-600 font-bold">Project LISTEN</p>
      </div>
    </div>
  )
}

export default Sidebar
