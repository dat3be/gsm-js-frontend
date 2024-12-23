'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Notification, sampleNotifications } from '../types/port'

export default function NotificationSystem() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulating API call with sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: Notification[] = sampleNotifications
        
        data.forEach((notification: Notification) => {
          toast(notification.message, {
            id: notification.id,
            icon: notification.type === 'success' ? '🟢' : notification.type === 'error' ? '🔴' : '🔵',
            duration: 5000,
          })
        })
        
        setError(null)
      } catch (err) {
        console.error('Error fetching notifications:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Check for new notifications every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Toaster position="bottom-right" />
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </>
  )
}

