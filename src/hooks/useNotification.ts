import { useAppSlice } from '@/redux/hooks/useAppSlice.ts'
import { IAppNotification } from '@/redux/app/app.slice.ts'
import { useCallback } from 'react'

/**
 *  A more straightforward way of showing notifications
 */
export const useNotification = () => {
  const { setAppNotification, setInfoNotification  } = useAppSlice()

  const notify = useCallback((message: string, type?: IAppNotification['type'], timestamp?: number): void => {
    setAppNotification({
      message: message || '',
      timestamp: timestamp || new Date().getTime(),
      type: type || 'info',
    })
  }, [])

  const info = useCallback((actionLabel: string, message: string, redirectedPageUrl: string) => {
    setInfoNotification({
      actionLabel,
      message: message || '',
      redirectedPageUrl
    })
  }, [])

  return {
    notify,
    info
  }
}
