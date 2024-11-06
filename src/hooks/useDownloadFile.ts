import { useState } from 'react'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'

const DEFAULT_ERROR_MESSAGE = `Unable to export. Please, try again!`
const DEFAULT_EMPTY_MESSAGE = `No content was found to export`

interface IDownloadStatus {
  message: string
  type: 'error' | 'info'
}

export const useDownloadFile = () => {
  const { access } = useAuthSlice()

  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<IDownloadStatus | null>(null)

  const error = () => (
    setStatus({
      message: DEFAULT_ERROR_MESSAGE,
      type: 'error'
    })
  )

  const download = (url: string, fileName: string, fileExtension: string) => {
    setIsLoading(true)
    setStatus(null)

    ;(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access}`
          }
        })

        if (!response.ok) {
          error()
          return
        }

        if (response.status === 204) {
          setStatus({
            message: DEFAULT_EMPTY_MESSAGE,
            type: 'info'
          })
          return
        }

        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = downloadUrl
        a.download = `${fileName}.${fileExtension}` // Set the filename
        a.click()

        window.URL.revokeObjectURL(downloadUrl)
      } catch (err) {
        error()
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return {
    download,
    isLoading,
    status
  }
}
