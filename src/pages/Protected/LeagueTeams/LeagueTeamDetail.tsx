import { Page } from '@/layouts/Page'
import { useCallback, useEffect, useMemo } from 'react'
import { PATH_TO_LEAGUE_TEAMS, PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import { MonroeBlueText, MonroeLinkText, ViewText } from '@/components/Elements'
import { Dot, SimpleEntityList } from '@/pages/Protected/MasterTeams/components/SimpleEntityList.tsx'
import { Flex } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetLeagueTeamQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { IDetailedError } from '@/common/interfaces'
import Loader from '@/components/Loader.tsx'
import CellText from '@/components/Table/CellText.tsx'
import { Button } from '@/components/Button.tsx'
import { EditOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'

const LeagueTeamDetail = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

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

  const onDelete = () => {}

  const onEdit = () => navigate(`${PATH_TO_LEAGUE_TEAMS}/edit/${data?.league?.id}`)

  // const onConnect = () => navigate(`${PATH_TO_LEAGUES}`)

  const renderControls = useCallback(() => {
    return (
      <>
        <Button danger={true} icon={<DeleteOutlined />} onClick={onDelete}>Delete</Button>
        <Button icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>Connect to league/tourn</Button>
      </>
    )
  }, [])

  // Render a loading indicator if data is still loading or unavailable
  if (isLoading || !data) return <Loader />

  const masterTeamData = data.masterTeamAdmins
    ? data.masterTeamAdmins
    : (data.masterTeamAdmin ? [data.masterTeamAdmin] : [])

  const navigateToMasterTeam = () => navigate(`${PATH_TO_MASTER_TEAMS}/${data.masterTeam?.id}`)
  const navigateToLeagueTeam = () => navigate(`${PATH_TO_LEAGUE_TEAMS}/${data.league?.id}`)

  return (
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
            {!data.masterTeam?.name && (<CellText>No master team</CellText>)}
          </Flex>
        </Flex>

        <SimpleEntityList title="Master Team Admin:" entities={masterTeamData} />
        <SimpleEntityList title="Coach:" entities={data.headCoach ? [data.headCoach] : undefined} />

        <Flex className="mb-16">
          <ViewText>Linked league/tourn:</ViewText>

          <Flex align="flex-start">
            <MonroeLinkText underline={false} onClick={navigateToLeagueTeam}>{data.league?.name}</MonroeLinkText>
            {!!data.division && (
              <Flex align="center">
                <Dot />
                <CellText>{data.division.name}</CellText>
                {/*<MonroeLinkText underline={false} onClick={navigateToMasterTeam}>{data.division.name}</MonroeLinkText>*/}
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
      </Flex>
    </Page>
  )
}

export default LeagueTeamDetail
