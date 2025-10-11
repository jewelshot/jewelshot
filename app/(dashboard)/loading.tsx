export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
