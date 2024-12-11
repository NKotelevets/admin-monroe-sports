import { useState } from 'react'
import { ScheduleStatus } from '@/components/ScheduleRequest/ScheduleStatus.tsx'
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface'
import { TColumns } from '@/common/types'
import { IScheduleEntry, IScheduleRequest } from '@/common/interfaces'
import { checkAmOrPm } from '@/utils'

/**
 * `useScheduleRequestTable` is a custom hook that manages the data and column structure for the master
 * team schedule request table.
 *
 * It processes and structures the schedule data into a format compatible with Ant Design's `Table` component and
 * generates dynamic columns based on the provided schedule data.
 *
 * @returns An object containing:
 * - `columns`: An array of table columns for the schedule table.
 * - `data`: The formatted schedule data.
 * - `setTableData`: A function to update the table data.
 *
 * @example
 * ```tsx
 * const { columns, data, setTableData } = useScheduleRequestTable()
 * ```
 */
export const useScheduleRequestTable = () => {
  const [data, setData] = useState<IScheduleEntry[] | null>(null)
  const [pureData, setPureData] = useState<IScheduleRequest | null>(null)

  /**
   * Generates dynamic columns for the table based on the `pureData` state.
   * Each column corresponds to a date, with the column title being the last two characters of the date (e.g., "01" for January).
   * Each column renders a `ScheduleStatus` component that displays the availability.
   *
   * @returns {Array} An array of column definitions for the Ant Design `Table` component.
   */
  const dynamicColumns = (): (ColumnGroupType<IScheduleEntry> | ColumnType<IScheduleEntry>)[] | undefined => {
    if (!pureData) return [] // Return empty if no data available

    const entries = Object.keys(pureData.data) // Cache entries array once
    const dColumns = []

    // Loop through each entry in the data and generate columns
    for (const key of entries) {
      dColumns.push({
        title: <div style={{ textAlign: 'center' }}>{key.slice(-2)}</div>,
        dataIndex: key,
        key: `col${key}${Math.random()}`,
        width: 45,
        render: (val: number) => {
          return <ScheduleStatus availability={val as 1 | 2 | 0}/>
        }
      })
    }

    return dColumns // Return the dynamically generated columns
  }

  // Columns definition for the table, including a fixed time column and dynamic date-based columns
  const columns: TColumns<IScheduleEntry> = [
    {
      title: '',
      dataIndex: 'time', // Fixed column for time
      key: 'time',
      fixed: 'left',
      width: 172,
      className: 'date-column'
    },
    ...dynamicColumns() || [] // Append dynamic columns if available
  ]

  /**
   * Sets the table data and updates the state for both `pureData` and `data`.
   *
   * @param {IScheduleRequest | null} tableData The schedule data to be set.
   */
  const setTableData = (tableData: IScheduleRequest | null) => {
    if (!tableData) return

    setPureData(tableData)
    setData(transformData(tableData.data))
  }

  return {
    columns, // Return the columns to be used in the table
    data, // Return the processed data to be used in the table
    setTableData // Return the function to update the table data
  }
}

/**
 * Transforms the raw schedule data into a structured array of `IScheduleEntry` objects.
 * Groups the data by time, associating each time with the availability status.
 *
 * @param {IScheduleRequest['data']} data The raw schedule data to be transformed.
 * @returns {IScheduleEntry[] | null} The transformed schedule data grouped by time.
 */
function transformData(data: IScheduleRequest['data']): IScheduleEntry[] | null {
  const grouped = new Map<string, IScheduleEntry>()

  // Iterate over each date and its associated schedule entries
  for (const [dateKey, entries] of Object.entries(data)) {
    for (const { time, availability } of entries) {
      const timeSplit = time.split(' - ')
      const timeFormatted = `${timeSplit[0]} ${checkAmOrPm(timeSplit[0])} - ${timeSplit[1]} ${checkAmOrPm(timeSplit[1])}`
      if (!grouped.has(timeFormatted)) {
        grouped.set(timeFormatted, { time: timeFormatted })
      }
      grouped.get(timeFormatted)![dateKey] = availability
    }
  }

  return Array.from(grouped.values())
}
