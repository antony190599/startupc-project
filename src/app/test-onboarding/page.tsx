/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getCurrentOnboardingStep, getOnboardingStatus } from '@/lib/utils/functions/onboarding'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestOnboardingPage() {
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState<any>(null)
  const [statusData, setStatusData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    if (!session?.user) return
    
    setIsLoading(true)
    try {
      const [currentStepData, statusData] = await Promise.all([
        getCurrentOnboardingStep(),
        getOnboardingStatus()
      ])
      
      setCurrentStep(currentStepData)
      setStatusData(statusData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      loadData()
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return <div>Please log in to test onboarding</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboarding Test Page</h1>
          <p className="text-gray-600">Testing onboarding step tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Step Info</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : currentStep ? (
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(currentStep, null, 2)}
                </pre>
              ) : (
                <div>No data</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Info</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : statusData ? (
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(statusData, null, 2)}
                </pre>
              ) : (
                <div>No data</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button onClick={loadData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(session.user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 