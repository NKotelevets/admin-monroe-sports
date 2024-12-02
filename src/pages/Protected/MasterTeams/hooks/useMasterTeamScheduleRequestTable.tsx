import { useState } from 'react'
import { IScheduleRequest, IScheduleEntry } from '@/common/interfaces/masterTeams.ts'
import { ScheduleStatus } from '@/pages/Protected/MasterTeams/ScheduleStatus.tsx'
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface'
import { TColumns } from '@/common/types'

export const useMasterTeamScheduleRequestTable = () => {
  const [data, setData] = useState<IScheduleEntry[] | null>(null)
  const [pureData, setPureData] = useState<IScheduleRequest[string] | null>(null)

  const dynamicColumns = (): (ColumnGroupType<IScheduleEntry> | ColumnType<IScheduleEntry>)[] | undefined => {
    if (!pureData) return []

    const entries = Object.keys(pureData) // Cache entries array once
    const dColumns = []

    for (const key of entries) {
      dColumns.push({
        title: <div style={{ textAlign: 'center' }}>{key.slice(-2)}</div>,
        dataIndex: key,
        key: `col${key}`,
        width: 45,
        render: (val: number) => {
          return <ScheduleStatus availability={val as 1 | 2 | 0}/>
        }
      })
    }

    return dColumns
  }

  const columns: TColumns<IScheduleEntry> = [
    {
      title: '',
      dataIndex: 'time', // Fixed column for time
      key: 'time',
      fixed: 'left',
      width: 172,
      className: 'date-column'
    },
    ...dynamicColumns() || []
  ]

  const setTableData = (tableData: IScheduleRequest[string] | null) => {
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

function transformData(data: IScheduleRequest[string]): IScheduleEntry[] | null {
  const grouped = new Map<string, IScheduleEntry>()

  for (const [dateKey, entries] of Object.entries(data)) {
    for (const { time, availability } of entries) {
      if (!grouped.has(time)) {
        grouped.set(time, { time })
      }
      grouped.get(time)![dateKey] = availability
    }
  }

  return Array.from(grouped.values())
}
