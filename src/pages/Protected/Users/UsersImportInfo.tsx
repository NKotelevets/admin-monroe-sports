import { Table } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { ReactElement, useState } from 'react'

import UsersReviewUpdateModal from '@/pages/Protected/Users/components/UsersReviewUpdateModal'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'
import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS } from '@/common/constants/paths'
import { useUsersImportInfoTableParams } from '@/pages/Protected/Users/hooks/useUsersImportInfoTableParams.tsx'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_USERS}>Users</a>,
  },
  {
    title: <MonroeBlueText>Import info</MonroeBlueText>,
  },
]

/**
 * The `UsersImportInfo` page displays a list of imported user records (from a CSV file)
 * and highlights duplicate or erroneous records found during the import process.
 * This component utilizes the custom `useUsersImportInfoTableParams` hook to manage table state
 * and configurations, providing a user-friendly overview of the data.
 *
 * ## Features:
 * - Renders a table with imported user records.
 * - Flags duplicate entries and errors within the dataset.
 * - Let users review and update the records they choose.
 *
 * @component
 *
 * @example
 * // Example usage in a parent component
 * <UsersImportInfo />
 *
 * @returns {ReactElement} A table view of the imported users, with duplicate and error flags.
 *
 * Dependencies:
 * - Ant Design's `Table` component for data rendering.
 * - `useUsersImportInfoTableParams` custom hook to manage table parameters and configurations.
 */
const UsersImportInfo = (): ReactElement => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const { importCSVTableRecords } = useUserSlice()
  const {
    columns,
    tableParams,
    handleTableChange
  } = useUsersImportInfoTableParams({
    setSelectedIdx,
    records: importCSVTableRecords
  })
<<<<<<< HEAD
=======
  const searchInput = useRef<InputRef>(null)
  const [sortSeasonNameOrder, setSortSeasonNameOrder] = useState<TSortOption>(null)
  const [sortLeagueNameOrder, setSortLeagueNameOrder] = useState<TSortOption>(null)

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IImportUsersCSVTableData> => ({
    filterDropdown: (props) => (
      <FilterDropDown {...props} handleReset={handleReset} handleSearch={handleSearch} searchInput={searchInput} />
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1A1657' : '#BDBCC2' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const handleTableChange: TableProps<IImportUsersCSVTableData>['onChange'] = (pagination, _, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
    })

    if (!Array.isArray(sorter) && sorter.field === 'name') setSortSeasonNameOrder(sorter.order || null)
    if (!Array.isArray(sorter) && sorter.field === 'leagueName') setSortLeagueNameOrder(sorter.order || null)
  }

  // const handleUpdate = (idx: number) => {
  //   return idx
  // }

  const columns: TColumns<IImportUsersCSVTableData> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: '240px',
      sorter: (s1, s2) => s1.firstName.localeCompare(s2.firstName),
      sortOrder: sortSeasonNameOrder,
      ...getColumnSearchProps('firstName'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.status === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        >
          {value}
        </CellText>
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      width: '240px',
      sortOrder: sortLeagueNameOrder,
      sorter: (s1, s2) => s1.lastName.localeCompare(s2.lastName),
      ...getColumnSearchProps('lastName'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.status === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        >
          {value}
        </CellText>
      ),
    },
    {
      title: '',
      dataIndex: 'gender',
      width: '80px',
      onFilter: (value, record) => value === record.gender,
      render: (value) => <CellText isLink>{SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filters: [
        { text: 'Male', value: 1 },
        { text: 'Female', value: 0 },
        { text: 'Other', value: 2 },
      ],
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '132px',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' },
      ],
      onFilter: (value, record) => value === record.status,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
      render: (value) => <TagType text={value} />,
    },
    {
      title: 'Error info',
      dataIndex: 'message',
      render: (value) => <TextWithTooltip maxLength={100} text={value} />,
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.status === 'Duplicate' && (
          <ReactSVG className="c-p" src={SyncIcon} onClick={() => setSelectedIdx(record.idx)} />
        ),
    },
  ]
>>>>>>> 6882c6d (- fixed breadcrumb path)

  return (
    <>
      {selectedIdx !== null && (
        <UsersReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />
      )}

      <BaseLayout>
        <Container>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <Title>Import info</Title>

          <Description>
            This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
            duplicate to review details, compare and decide whether to keep existing records or replace them with new
            entries. This helps ensure your data is accurate and up-to-date.
          </Description>

          <Table
            columns={columns}
            rowKey={(record) => record.idx}
            dataSource={importCSVTableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Container>
      </BaseLayout>
    </>
  )
}

export default UsersImportInfo
