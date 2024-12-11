import { transformKeysToSnakeCase } from '@/utils'
import dayjs from 'dayjs'
import { useDownloadFile } from '@/hooks/useDownloadFile.ts'
import { IDownloadStatus } from '@/common/interfaces'

export interface IUseMasterTeamExportCSVReturn {
  isLoading: boolean
  status: IDownloadStatus | null

  onExport(
    startDate: string,
    endDate: string,
    masterTeamIds: string,
    path: string,
    fileName?: string,
    fileExtension?: string
    ): void
}

/**
 * Custom hook for exporting master team availability data as a CSV file.
 *
 * Provides functionality to initiate a file download for master team availability
 * based on a specified date range and team IDs. Utilizes the `useDownloadFile`
 * hook for managing file downloads.
 *
 * @returns {IUseMasterTeamExportCSVReturn} - An object containing:
 *  - `onExport`: A function to initiate the export process.
 *  - `isLoading`: A boolean indicating whether the file is currently being downloaded.
 *  - `status`: The current status of the download process.
 *
 * @function onExport
 * @param {string} startDate - The start date for the export range (YYYY-MM-DD format).
 * @param {string} endDate - The end date for the export range (YYYY-MM-DD format).
 * @param {string} masterTeamIds - A string containing the IDs of the master teams to be exported.
 *
 * Example usage:
 * ```typescript
 * const { onExport, isLoading, status } = useMasterTeamExportCSV();
 * onExport('2023-01-01', '2023-12-31', 'team1,team2');
 * ```
 */
export const useExportScheduleCSV = (): IUseMasterTeamExportCSVReturn => {
  const { download, isLoading, status } = useDownloadFile()

  const onExport = (
    startDate: string,
    endDate: string,
    masterTeamIds: string,
    path: string,
    fileName: string = 'team_availability',
    fileExtension: string = 'xlsx'
  ) => {
    const params = transformKeysToSnakeCase({
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      teamIds: masterTeamIds
    }) as Record<string, string>

    download(`${path}?${new URLSearchParams(params).toString()}`, fileName, fileExtension)
  }

  return {
    onExport,
    isLoading,
    status
  }
}
