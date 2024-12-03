import { useState } from 'react'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'
import { IDownloadStatus } from '@/common/interfaces'

const DEFAULT_ERROR_MESSAGE = `Unable to export. Please, try again!`
const DEFAULT_EMPTY_MESSAGE = `No content was found to export`

/**
 * Custom hook for downloading files from the backend.
 *
 * Manages file download functionality, including authentication, error handling,
 * and status updates. Allows users to download files by specifying the target
 * endpoint, filename, and file extension.
 *
 * @returns {Object} - An object containing:
 *  - `download`: A function to initiate the file download.
 *  - `isLoading`: A boolean indicating whether a download is currently in progress.
 *  - `status`: An object representing the current status of the download,
 *    including a message and type ('info' or 'error').
 *
 * @constant DEFAULT_ERROR_MESSAGE
 *  - Default error message displayed when a download fails.
 * @constant DEFAULT_EMPTY_MESSAGE
 *  - Default message displayed when no content is found to download.
 *
 * @function download
 * @param {string} url - The API endpoint to fetch the file from, relative to the backend URL.
 * @param {string} fileName - The name to use for the downloaded file (excluding the extension).
 * @param {string} fileExtension - The extension to use for the downloaded file (e.g., 'xlsx', 'pdf').
 *
 * @example
 * const { download, isLoading, status } = useDownloadFile();
 * download('reports/export', 'report', 'pdf');
 *
 * @example
 * if (status?.type === 'error') {
 *   console.error(status.message);
 * }
 *
 * @remarks
 * - This hook uses the `useAuthSlice` hook to fetch the current user's access token.
 * - Handles both errors (e.g., network issues or unauthorized access) and
 *   cases where no content is available (204 status).
 */
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
