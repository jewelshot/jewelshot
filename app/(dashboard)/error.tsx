'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error (ileride Sentry eklenebilir)
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bir hata olustu</h2>
        <p className="text-sm text-gray-600 mb-4">
          Dashboard yuklenirken bir sorun olustu. Lutfen tekrar deneyin.
        </p>
        <Button onClick={reset} className="w-full">
          Tekrar Dene
        </Button>
      </Card>
    </div>
  )
}
