import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface BudgetAllocationProps {
  painPoints: string[]
  onSubmit?: (allocations: { [key: string]: number }) => void
}

const BudgetAllocation = ({ painPoints, onSubmit }: BudgetAllocationProps) => {
  const [allocations, setAllocations] = useState<{ [key: string]: number }>({})
  const [totalAllocated, setTotalAllocated] = useState(0)

  useEffect(() => {
    const initialAllocations: { [key: string]: number } = {}
    painPoints.forEach(painPoint => {
      initialAllocations[painPoint] = 0
    })
    setAllocations(initialAllocations)
  }, [painPoints])

  useEffect(() => {
    const total = Object.values(allocations).reduce((sum, value) => sum + value, 0)
    setTotalAllocated(total)
  }, [allocations])

  const handleAllocationChange = (painPoint: string, value: number) => {
    const newAllocations = { ...allocations }
    newAllocations[painPoint] = value
    setAllocations(newAllocations)
  }

  const handleSliderChange = (painPoint: string, values: number[]) => {
    handleAllocationChange(painPoint, values[0])
  }

  const handleInputChange = (painPoint: string, value: string) => {
    const numValue = parseInt(value) || 0
    if (numValue >= 0 && numValue <= 100) {
      handleAllocationChange(painPoint, numValue)
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(allocations)
    }
  }

  const isValidAllocation = totalAllocated === 100
  const isOverBudget = totalAllocated > 100
  const isUnderBudget = totalAllocated < 100 && totalAllocated > 0

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's prioritize your challenges
        </h2>
        <p className="text-gray-600">
          If you had £100 to invest in solving these problems, how would you allocate it?
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {painPoints.map((painPoint, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 flex-1 pr-4">
                {painPoint}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-evo-red-500 font-semibold">£</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={allocations[painPoint] || 0}
                  onChange={(e) => handleInputChange(painPoint, e.target.value)}
                  className="w-20 text-center"
                />
              </div>
            </div>
            
            <div className="px-2">
              <Slider
                value={[allocations[painPoint] || 0]}
                onValueChange={(values) => handleSliderChange(painPoint, values)}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>£0</span>
                <span>£100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900">
            Total allocated:
          </span>
          <span className={`text-xl font-bold ${
            totalAllocated === 100 ? 'text-green-600' : 'text-red-500'
          }`}>
            £{totalAllocated} / £100
          </span>
        </div>
        
        {/* Error messages for invalid totals */}
        {isOverBudget && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm font-medium">
              You've allocated £{totalAllocated - 100} over budget. Please reduce your allocations.
            </p>
          </div>
        )}
        
        {isUnderBudget && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-amber-700 text-sm font-medium">
              You have £{100 - totalAllocated} remaining to allocate. Please distribute the full £100.
            </p>
          </div>
        )}
        
        {totalAllocated === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
            <p className="text-gray-600 text-sm">
              Please start allocating your £100 budget across the challenges above.
            </p>
          </div>
        )}
        
        {totalAllocated === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-700 text-sm font-medium">
              ✓ Perfect! You've allocated the full £100 budget.
            </p>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={!isValidAllocation}
          className={`w-full ${
            isValidAllocation 
              ? 'evo-button' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
          }`}
        >
          {isValidAllocation ? 'Submit Budget Allocation' : 'Complete £100 Allocation to Continue'}
        </Button>
      </div>
    </div>
  )
}

export default BudgetAllocation
