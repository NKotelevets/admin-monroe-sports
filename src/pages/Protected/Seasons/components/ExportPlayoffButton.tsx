import { FileExcelOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import { useDownloadFile } from '@/hooks/useDownloadFile.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useEffect } from 'react'

export const ExportPlayoffButton = () => {
  const { bracketData } = useSeasonFormContext()
  const { selectedBracketId } = useSeasonSlice()
  const { download, isLoading, status } = useDownloadFile()
  const { notify } = useNotification()

  useEffect(() => {
    if (!status) return
    notify(status.message, status.type === 'info' ? 'success' : status.type)
  }, [status])

  const handleExport = async () => {
    if (selectedBracketId) {
      download(
        `teams/seasons/export-bracket`,
        bracketData?.name || 'bracket',
        'csv',
        'POST',
        {
          'Content-Type': 'application/json'
        },
        JSON.stringify({ id: selectedBracketId })
      )
    }
  }

  return (
    <Button
      icon={<FileExcelOutlined />}
      iconPosition="start"
      type="default"
      onClick={handleExport}
      loading={isLoading}
    >
      Export Playoff Template CSV
    </Button>
  )
}
