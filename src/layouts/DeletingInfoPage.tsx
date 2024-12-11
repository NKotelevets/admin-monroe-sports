import type { TableProps } from 'antd'
import { Table } from 'antd'

import { IDeletingError } from '@/common/interfaces'
import { IPageProps, Page } from '@/layouts/Page'
import { useDeletingInfoTable } from '@/hooks/useDeletingInfoTable.tsx'

interface IDeletingInfoPageProps extends Omit<IPageProps, 'children'>{
  dataSource: IDeletingError[]
  pathToObject: string
  objectColumnTitle: string
}

/**
 * LeagueTeamDeletingInfo Page
 *
 * This component renders a page that provides an overview of objects that could not be deleted due to errors.
 * It displays a table summarizing the records with deletion issues, allowing users to navigate to specific team details
 * and address the errors.
 *
 * Returns:
 * - A `Page` component containing a `Table` that lists object deletion errors.
 *
 * Example:
 * ```jsx
 * <DeletingInfo dataSource={dataSource} objectColumnTitle={objectColumnTitle} />
 * ```
 */
const DeletingInfoPage = (props: IDeletingInfoPageProps) => {
  const {
    title,
    subtitle,
    breadcrumbs,
    dataSource ,
    pathToObject,
    objectColumnTitle
  } = props

  const {
    columns,
    tableParams,
    setTableParams
  } = useDeletingInfoTable({
    pathToObject,
    objectColumnTitle
  })

  /**
   * Handles changes to the table's state (pagination, filters, sorting).
   *
   * @param pagination - Pagination information (current page, page size, etc.).
   * @param filters - Filter criteria applied to the table data.
   * @param sorter - Sorting information (field and order). Supports single or multiple sorts.
   */
  const handleTableChange: TableProps<IDeletingError>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field
    })
  }

  return (
    <Page
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
    >
      <Table
        columns={columns}
        rowKey={(record) => record.name}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </Page>
  )
}

export default DeletingInfoPage
