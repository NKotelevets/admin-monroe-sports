import Flex from 'antd/es/flex'
import { TableProps } from 'antd/es/table/InternalTable'
import { Fragment, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import TextWithTooltip from '@/components/TextWithTooltip'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_MASTER_TEAMS, PATH_TO_USERS } from '@/common/constants/paths'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams'

import CopyIcon from '@/assets/icons/copy.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { getColumnSort } from '@/utils'
import { MonroeLinkText } from '@/components/Elements'

type TColumns<T> = TableProps<T>['columns']

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
}

export const useMasterTeamsTable = ({ setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const navigate = useNavigate()
  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { limit, offset, ordering } = useMasterTeamsSlice()
  const [getMasterTeams] = useLazyGetMasterTeamsQuery()
  const { notify } = useNotification()

  function handleReset() {
    getMasterTeams({
      limit,
      offset,
      ordering: ordering || undefined
    })
  }

  const handleCopyContent = useCallback(async (email: string) => {
    await navigator.clipboard.writeText(email)
    notify('Email successfully copied', 'success')
  }, [])

  const onFilterLeague = useCallback((value: boolean | React.Key, record: IFEMasterTeam) => {
    return !!record['leagues'].filter(league => league.name.toLowerCase().includes((value as string).toLowerCase())).length
  }, [])

  const renderTeamAdmins = useCallback((_: unknown, record: IFEMasterTeam) => (
    <>
      {record.teamAdmins?.map((admin, index) => (
        (
          <Fragment key={`${admin.id}-row-team-admin`}>
            <MonroeLinkText
              inline={true}
              underline={false}
              onClick={() => navigate(PATH_TO_USERS + '/' + admin.id)}
            >
              {admin.firstName}
            </MonroeLinkText>
            {record.teamAdmins?.length !== index + 1 ? `, ` : undefined}
          </Fragment>
        )
      ))}
    </>
  ), [])

  const columns: TColumns<IFEMasterTeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: getColumnSort('name', ordering),
      ...getColumnSearchProps('name'),
      render: (_, record) => (
        <TextWithTooltip
          maxLength={22}
          text={record.name}
          onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}
        />
      )
    },
    {
      title: 'Team Administrator',
      dataIndex: 'teamAdmins',
      width: '240px',
      ...getColumnSearchProps('teamAdmins'),
      sortOrder: getColumnSort('team_admin', ordering),
      sorter: true,
      render: renderTeamAdmins
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'teamAdminEmail',
      width: '240px',
      render: (_, record) => (
        <>
          {record.teamAdminEmail ? (
            <Flex
              align="center"
              justify="space-between"
              onClick={() => handleCopyContent(record.teamAdminEmail as string)}
            >
              <TextWithTooltip maxLength={21} text={record.teamAdminEmail} isRegularText />
              <ReactSVG className="c-p mg-l4" src={CopyIcon} />
            </Flex>
          ) : (
            '-'
          )}
        </>
      )
    },
    {
      title: 'Head Coach',
      dataIndex: 'headCoachFullName',
      width: '240px',
      ...getColumnSearchProps('headCoachFullName'),
      sortOrder: getColumnSort('head_coach', ordering),
      sorter: true,
      render: (_, record) => (
        <>
          {record.headCoachFullName ? (
            <TextWithTooltip
              maxLength={22}
              text={record.headCoachFullName}
              onClick={() => navigate(PATH_TO_USERS + '/' + record.headCoachId)}
            />
          ) : (
            '-'
          )}
        </>
      )
    },
    {
      title: 'Coach email',
      dataIndex: 'headCoachEmail',
      width: '240px',
      render: (_, record) => (
        <>
          {record.headCoachEmail ? (
            <Flex
              align="center"
              justify="space-between"
              onClick={() => handleCopyContent(record.headCoachEmail as string)}
            >
              <TextWithTooltip maxLength={21} text={record.headCoachEmail} isRegularText />
              <ReactSVG className="c-p mg-l4" src={CopyIcon} />
            </Flex>
          ) : (
            '-'
          )}
        </>
      )
    },
    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'league_name',
      width: '240px',
      ...getColumnSearchProps('leagues', onFilterLeague),
      sorter: true,
      sortOrder: getColumnSort('league_name', ordering),
      render: (_, record) => (
        <TextWithTooltip
          maxLength={22}
          text={record.leagues.map((l) => l.name).join(', ') || '-'}
          onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}
        />
      )
    },

    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value, record) => (
        <Flex className="c-p" justify="center" align="center">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_MASTER_TEAM + `/${record.id}`)
            }}
          />

          <ReactSVG
            className="mg-l8"
            onClick={() => {
              setSelectedRecordId(value.id)
              setShowDeleteSingleRecordModal(true)
            }}
            src={DeleteIcon}
          />
        </Flex>
      )
    }
  ]

  return {
    columns
  }
}

