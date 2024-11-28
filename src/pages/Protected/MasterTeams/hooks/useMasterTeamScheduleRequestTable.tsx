// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TColumns } from '@/common/types'
import { useState } from 'react'
import { IScheduleRequest } from '@/common/interfaces/masterTeams.ts'
import { ScheduleStatus } from '@/pages/Protected/MasterTeams/ScheduleStatus.tsx'

export const useMasterTeamScheduleRequestTable = () => {
  const [data, setData] = useState(null)
  const [pureData, setPureData] = useState(null)

  const dynamicColumns = () => {
    if (!pureData) return []

    const entries = Object.keys(pureData) // Cache entries array once
    const dColumns = []

    for (const key of entries) {
      dColumns.push({
        title: <div style={{ textAlign: 'center' }}>{key.slice(-2)}</div>,
        dataIndex: key,
        key: `col${key}`,
        width: 45,
        render: (val) => <ScheduleStatus availability={val as 1 | 2 | 0}/>
      })
    }

    return dColumns
  }

  const columns: TColumns<IScheduleRequest> = [
    {
      title: '',
      dataIndex: 'time', // Fixed column for time
      key: 'time',
      fixed: 'left',
      width: 172,
      className: 'date-column'
    },
    ...dynamicColumns()
  ]

  const setTableData = (tableData: unknown) => {
    if (!tableData) return

    setPureData(tableData)
    setData(transformData(tableData))
  }

  return {
    columns,
    data,
    setTableData
  }
}

function transformData(data: { [key: string]: {time: string, availability: number}[] }) {
  const grouped = new Map()

  // Iterate through each date key
  for (const [dateKey, entries] of Object.entries(data)) {
    for (const { time, availability } of entries) {
      // Check if the time already exists in the Map
      if (!grouped.has(time)) {
        grouped.set(time, { time }) // Initialize the object with the time key
      }
      grouped.get(time)[dateKey] = availability // Add the current date's value
    }
  }

  // Convert the Map back to an array
  return Array.from(grouped.values())
}
