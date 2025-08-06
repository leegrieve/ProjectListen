import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { Calendar, FileText, Users } from 'lucide-react'

interface EnhancedRecommendationsProps {
  allocations: { [key: string]: number }
  painPoints: string[]
  conversationText: string
}

const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({
  allocations,
  conversationText
}) => {
  const sortedAllocations = Object.entries(allocations)
    .filter(([_, amount]) => amount > 0)
    .sort(([_, a], [__, b]) => b - a)

  const topPriorities = sortedAllocations.slice(0, 3)

  const extractSpecificROI = (challengeType: string) => {
    const noShowMatch = conversationText.match(/£(\d+).*(?:no-show|weekend|week)/i)
    const wageMatch = conversationText.match(/(\d+)%.*(?:over budget|wage|labor|staff cost)/i)
    
    if (challengeType.includes('Revenue') || challengeType.includes('Booking')) {
      if (noShowMatch) {
        const weeklyLoss = parseInt(noShowMatch[1])
        const annualLoss = weeklyLoss * 52
        const recoveredAmount = Math.round(annualLoss * 0.7)
        return `Reduce no-shows by 70% = £${recoveredAmount.toLocaleString()} recovered annually`
      }
      return 'Reduce no-shows and maximize table turnover'
    }
    
    if (challengeType.includes('Staff') || challengeType.includes('Operational')) {
      if (wageMatch) {
        const overBudgetPercent = parseInt(wageMatch[1])
        const savings = Math.round(8000 * 12 * (overBudgetPercent / 100) * 0.8)
        return `Reduce overspend by 80% = £${savings.toLocaleString()} saved annually`
      }
      return 'Streamline operations and reduce manual processes'
    }
    
    return 'Enhanced customer engagement and satisfaction'
  }

  const challengeToSolution: { [key: string]: { title: string; solution: string; description: string; benefits: string } } = {
    'Revenue': {
      title: 'Revenue Optimization',
      solution: 'Intelligent booking and reservation solution',
      description: 'Advanced booking management system',
      benefits: 'Reduce no-shows and maximize table turnover'
    },
    'Booking': {
      title: 'Revenue Optimization', 
      solution: 'Intelligent booking and reservation solution',
      description: 'Advanced booking management system',
      benefits: 'Reduce no-shows and maximize table turnover'
    },
    'Staff': {
      title: 'Operational Excellence',
      solution: 'Smart staff scheduling solution',
      description: 'Intelligent workforce management',
      benefits: 'Reduce manual processes and cut costs'
    },
    'Operational': {
      title: 'Operational Excellence',
      solution: 'Smart staff scheduling solution', 
      description: 'Intelligent workforce management',
      benefits: 'Reduce manual processes and cut costs'
    },
    'Customer': {
      title: 'Customer Experience Enhancement',
      solution: 'Digital engagement platform',
      description: 'Enhanced customer interaction tools',
      benefits: 'Boost satisfaction and modernize experience'
    },
    'Digital': {
      title: 'Customer Experience Enhancement',
      solution: 'Digital engagement platform',
      description: 'Enhanced customer interaction tools', 
      benefits: 'Boost satisfaction and modernize experience'
    }
  }

  const getPhases = () => {
    const usedSolutions = new Set()
    const phases: Array<{
      number: number
      title: string
      timeframe: string
      pebbles: number
      solution: string
      description: string
      benefits: string
      roi: string
    }> = []

    let phaseNumber = 1
    topPriorities.forEach(([challenge, amount]) => {
      const solutionKey = Object.keys(challengeToSolution).find(key => challenge.includes(key))
      if (solutionKey) {
        const solution = challengeToSolution[solutionKey]
        const solutionId = `${solution.solution}-${solution.title}`
        
        if (!usedSolutions.has(solutionId)) {
          usedSolutions.add(solutionId)
          const timeframe = phaseNumber === 1 ? 'Months 1–3' : phaseNumber === 2 ? 'Months 2–4' : 'Months 3–6'
          
          phases.push({
            number: phaseNumber,
            title: solution.title,
            timeframe,
            pebbles: amount,
            solution: solution.solution,
            description: solution.description,
            benefits: solution.benefits,
            roi: extractSpecificROI(solutionKey)
          })
          phaseNumber++
        }
      }
    })

    return phases
  }

  const phases = getPhases()

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 shadow-lg">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Recommendations
          </h2>
          <p className="text-gray-600">
            Based on your pebble allocation, here's your custom implementation roadmap
          </p>
        </div>

      <Card className="evo-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Your Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topPriorities.map(([challenge, amount], index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{challenge}</span>
                <span className="text-sm font-semibold text-evo-red-600">
                  {amount} 🪨
                </span>
              </div>
              <Progress 
                value={amount} 
                className="h-2 bg-red-100"
              />
              <div className="text-xs text-gray-500">
                {amount}/100 🪨 allocated
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Your Custom Flight Path
        </h3>
        
        {phases.map((phase) => (
          <Card key={phase.number} className="evo-card border-l-4 border-l-evo-teal-500">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-xl font-bold text-gray-900">
                Phase {phase.number} – {phase.title} ({phase.pebbles} 🪨, {phase.timeframe})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-evo-teal-600 font-bold text-base mt-0.5">✔</span>
                  <span className="font-semibold text-gray-900">{phase.solution}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-evo-teal-600 font-bold text-base mt-0.5">✔</span>
                  <span className="text-gray-700">{phase.description}</span>
                </div>
              </div>
              
              <div className="bg-evo-teal-50 rounded-lg p-3 border border-evo-teal-200">
                <div className="text-sm font-medium text-evo-teal-800 mb-1">
                  Expected Benefits:
                </div>
                <div className="text-sm text-evo-teal-700">
                  {phase.benefits}
                </div>
                {phase.roi && (
                  <div className="text-sm text-evo-teal-700 mt-1">
                    • {phase.roi}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="evo-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="evo-button flex items-center space-x-2 h-12">
              <Calendar className="w-4 h-4" />
              <span>Schedule Demo</span>
            </Button>
            <Button className="evo-button flex items-center space-x-2 h-12">
              <FileText className="w-4 h-4" />
              <span>Download Report</span>
            </Button>
            <Button className="evo-button flex items-center space-x-2 h-12">
              <Users className="w-4 h-4" />
              <span>Connect with Specialist</span>
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            This custom flight path directly reflects your priorities and will address your specific pain points in order of importance to you.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default EnhancedRecommendations
