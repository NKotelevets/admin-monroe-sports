import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import { Typography } from 'antd'
import Flex from 'antd/es/flex'
import { ReactElement, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'

import MonroeFilter from '@/components/Table/MonroeFilter.tsx'

import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'

import { getIconColor } from '@/utils'

import { MASTER_ADMIN_ROLE } from '@/common/constants'
import { US_STATES } from '@/common/constants/location.ts'
import { PATH_TO_LOCATIONS, PATH_TO_LOCATIONS_EDIT } from '@/common/constants/paths.ts'
import { ILocation } from '@/common/interfaces/location.ts'
import { TColumns } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

/**
 * Generates and returns the configuration for a locations table.
 *
 * @function
 * @name useLocationsTable
 * @description This function configures columns and behaviors for a table displaying locations data. It includes capabilities such as filtering, searching, and rendering actions for each record. The function makes use of dependencies like `useTableSearch`, `useTableContext`, and `useUserSlice`. It also has logic to manage user permissions for deletion.
 * @returns {Object} An object containing the table columns configuration.
 */
export const useLocationsTable = () => {
  const navigate = useNavigate()
  const { user } = useUserSlice()
  const canDelete = user?.isSuperuser || !!user?.roles.filter((role) => [MASTER_ADMIN_ROLE].includes(role)).length

  const { getColumnSearchProps } = useTableSearch()
  const { setSelectedIds, setSingleDeleting } = useTableContext<ILocation>()

  useEffect(() => {
    setSelectedIds([])
  }, [])

  /**
   * A memoized callback function that renders a filter icon.
   * The icon's color is determined by the provided filtered state.
   *
   * @function
   * @name filterIcon
   * @param {boolean} filtered - Indicates if the filter is applied.
   * @returns {ReactElement} The styled filter icon.
   */
  const filterIcon = useCallback((filtered: boolean): ReactElement => <FilterFilled style={{ color: getIconColor(filtered) }} />, [])

  const columns: TColumns<ILocation> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: true,
      width: 264,
      sorter: true,
      ...getColumnSearchProps('name'),
      render: (_, record) => (
        <Typography.Link href={`${PATH_TO_LOCATIONS}/${record.id}`}>{record.name}</Typography.Link>
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 98,
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filters: US_STATES,
      filterIcon,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 176,
      ...getColumnSearchProps('city'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      width: 356,
      render: (_, record) => (
        <Typography.Text ellipsis copyable>
          {record.address}
        </Typography.Text>
      ),
    },

    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      key: 'zip',
      width: 98,
      ...getColumnSearchProps('zipCode'),
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '98px',
      fixed: 'right',
      render: (value, record) => (
        <Flex className="c-p" justify="center" align="center">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(`${PATH_TO_LOCATIONS_EDIT}/${record.id}`)
            }}
          />
          {canDelete && (
            <div className="mg-l8">
              <DeleteWrapper
                onClick={() => {
                  setSingleDeleting(true)
                  setSelectedIds([value.id])
                }}
              >
                <ReactSVG src={DeleteIcon} />
              </DeleteWrapper>
            </div>
          )}
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}
