import { Page } from '@/layouts/Page'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_LEAGUES,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_SEASONS
} from '@/common/constants/paths.ts'
import { MonroeBlueText, MonroeLinkText, ViewText } from '@/components/Elements'
import { Dot, SimpleEntityList } from '@/pages/Protected/MasterTeams/components/SimpleEntityList.tsx'
import { Flex, Tag } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteLeagueTeamMutation, useGetLeagueTeamQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { IDetailedError } from '@/common/interfaces'
import Loader from '@/components/Loader.tsx'
import CellText from '@/components/Table/CellText.tsx'
import { Button } from '@/components/Button.tsx'
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import MonroeModal from '@/components/MonroeModal.tsx'

const LeagueTeamDetail = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLT] = useDeleteLeagueTeamMutation()

  const { notify } = useNotification()
  const {
    data,
    isLoading,
    isError,
    error
  } = useGetLeagueTeamQuery({ id: params.id || '' }, { skip: !params.id })

  /**
   * Redirects to the master teams list if there is an error fetching the team,
   * and displays an error notification.
   */
  useEffect(() => {
    if (isError) {
      navigate(PATH_TO_LEAGUE_TEAMS)
      notify((error as IDetailedError).details, 'error')
    }
  }, [isError])

  const breadCrumbs = useMemo(() => ([
    { title: <a href={PATH_TO_LEAGUE_TEAMS}>League Teams</a> },
    { title: <MonroeBlueText>{data?.name}</MonroeBlueText> }
  ]), [data])

  const navigateToMasterTeam = useCallback(() =>
      navigate(`${PATH_TO_MASTER_TEAMS}/${data?.masterTeam?.id}`)
    , [data])

  const navigateToLeague = useCallback(() =>
      navigate(`${PATH_TO_LEAGUES}/${data?.league?.id}`)
    , [data])

  const navigateToSeason = useCallback(() =>
      navigate(`${PATH_TO_SEASONS}/${data?.season?.id}`)
    , [data])

  const renderControls = useCallback(() => {
    const onEdit = () => navigate(`${PATH_TO_LEAGUE_TEAMS}/edit/${data?.id}`)

    return (
      <>
        <Button
          danger={true}
          icon={<DeleteOutlined />}
          disabled={data?.canBeDelete === false}
          onClick={() => setShowDeleteModal(true)}
        >Delete</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
      </>
    )
  }, [data])

  const handleDelete = useCallback((id: string) => {
    deleteLT(id)
      .unwrap()
      .then(() => navigate(PATH_TO_LEAGUE_TEAMS))
      .catch((error) => {
        setShowDeleteModal(false)
        notify((error as IDetailedError).details, 'error')
      })
  }, [data?.canBeDelete])

  // Render a loading indicator if data is still loading or unavailable
  if (isLoading || !data) return <Loader />

  const masterTeamData = data.masterTeamAdmins
    ? data.masterTeamAdmins
    : (data.masterTeamAdmin ? [data.masterTeamAdmin] : [])

  return (
    <>
      {showDeleteModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => handleDelete(params.id as string)}
          title={`Delete ${data.name}?`}
          type="warn"
          content={<p>Are you sure you want to delete {data.name}?</p>}
        />
      )}
      <Page
        title={data.name}
        breadcrumbs={breadCrumbs}
        controls={renderControls}
      >
        <Flex vertical>
          <Flex className="mb-16">
            <ViewText>Master team:</ViewText>

            <Flex vertical>
              {!!data.masterTeam?.name && (
                <MonroeLinkText underline={false} onClick={navigateToMasterTeam}>{data.masterTeam.name}</MonroeLinkText>
              )}
              {!data.masterTeam?.name && (<Tag icon={<CloseCircleOutlined />} color="orange">Waiting for MT</Tag>)}
            </Flex>
          </Flex>

          <SimpleEntityList title="Master Team Admin:" entities={masterTeamData} />
          <SimpleEntityList title="Coach:" entities={data.headCoach ? [data.headCoach] : undefined} />

          <Flex className="mb-16">
            <ViewText>Linked league/tourn:</ViewText>

            <Flex align="flex-start">
              <MonroeLinkText underline={false} onClick={navigateToLeague}>{data.league?.name}</MonroeLinkText>
              {!!data.division && (
                <Flex align="center">
                  <Dot />
                  <CellText>{data.division.name}</CellText>
                </Flex>
              )}
              {!!data.subdivision && (
                <Flex align="center">
                  <Dot />
                  <CellText>{data.subdivision.name}</CellText>
                </Flex>
              )}
            </Flex>
          </Flex>
          {!!data.season && (
            <Flex className="mb-16">
              <ViewText>Linked Season:</ViewText>

              <Flex align="flex-start">
                <MonroeLinkText underline={false} onClick={navigateToSeason}>{data.season?.name}</MonroeLinkText>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Page>
    </>
  )
}

export default LeagueTeamDetail
