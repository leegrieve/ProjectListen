import BudgetAllocation from './BudgetAllocation'

const BudgetAllocationDemo = () => {
  const samplePainPoints = [
    "Revenue Optimization",
    "Staff Scheduling",
    "Operational Efficiency",
    "Customer Experience"
  ]

  const handleSubmit = (allocations: { [key: string]: number }) => {
    console.log('Budget allocations:', allocations)
    alert(`Budget allocated: ${JSON.stringify(allocations, null, 2)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Budget Allocation Component Demo</h1>
        <BudgetAllocation 
          painPoints={samplePainPoints}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default BudgetAllocationDemo
