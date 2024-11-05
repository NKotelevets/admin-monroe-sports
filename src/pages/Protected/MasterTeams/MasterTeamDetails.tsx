import { PlusOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

import {
  MonroeBlueText,
  MonroeDeleteButton,
  MonroeLightBlueText,
  MonroeSecondaryButton,
  PageContainer,
  ProtectedPageTitle,
  ViewText,
  ViewTextInfo
} from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useDeleteMasterTeamMutation, useGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_LEAGUE_PAGE, PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'
import styled from '@emotion/styled'
import { IFELeague } from '@/common/interfaces/league.ts'
import { IFEDivision, IFESubdivision } from '@/common/interfaces/division.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { SimpleEntityList } from './components/SimpleEntityList'

/**
 * Page for showing details of a master team in the admin panel.
 *
 * This page fetches and displays information about a specific master team,
 * including its administrator, head coach, coaches, players, and associated leagues.
 * It also provides options for editing or deleting the team.
 *
 * @component
 */
const MasterTeamDetails = () => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetMasterTeamQuery({ id: params.id || '' }, { skip: !params.id })
  const { notify } = useNotification()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMT] = useDeleteMasterTeamMutation()

  /**
   * Redirects to the master teams list if there is an error fetching the team,
   * and displays an error notification.
   */
  useEffect(() => {
    if (isError) {
      navigate(PATH_TO_MASTER_TEAMS)
      notify((error as IDetailedError).details, 'error')
    }
  }, [isError])


  const breadCrumbItems = useMemo(() => ([
    { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
    { title: <MonroeBlueText>{data?.name}</MonroeBlueText> }
  ]), [data])

  /**
   * Processes and removes duplicate league entries from the master team data.
   */
  const leagues = useMemo(() => (
    [...new Map(data?.leagues.map(item => [item.id, item])).values()]
  ), [data])

  const handleDelete = useCallback((id: string) => {
    deleteMT(id)
      .unwrap()
      .then(() => navigate(PATH_TO_MASTER_TEAMS))
      .catch((error) => {
        notify((error as IDetailedError).details, 'error')
      })
  }, [])

  // Render a loading indicator if data is still loading or unavailable
  if (isLoading || !data) return <Loader />

  return (
    <>
      <Helmet>
        <title>Admin Panel | Master Team Details</title>
      </Helmet>

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

      <BaseLayout>
        <PageContainer>
          <Breadcrumb items={breadCrumbItems} />

          <Flex justify="space-between">
            <ProtectedPageTitle>{data.name}</ProtectedPageTitle>

            <Flex>
              <MonroeDeleteButton
                icon={<DeleteOutlined />}
                iconPosition="start"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </MonroeDeleteButton>

              <MonroeSecondaryButton
                icon={<EditOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/${params!.id}`)}
                className="h-32"
              >
                Edit
              </MonroeSecondaryButton>

              <MonroeButton
                isDisabled
                label="Connect to league/tourn"
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/:id`)}
                className="h-32"
              />
            </Flex>
          </Flex>

          <Flex vertical>
            <SimpleEntityList title="Team Administrator:" entities={data.teamsAdmins} />
            <SimpleEntityList title="Head Coach:" entities={[data.headCoach]} />
            <SimpleEntityList title="Coach(es):" entities={data.coaches} />
            <SimpleEntityList title="Players:" entities={data.players} />
            <LinkedLeagueList
              leagues={leagues}
              divisions={data.divisions}
              subDivisions={data.subDivisions}
            />
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

interface ILinkedLeagueListProps {
  leagues: IFELeague[]
  divisions: IFEDivision[]
  subDivisions: IFESubdivision[]
}

/**
 * LinkedLeagueList component displays a list of leagues associated with a master team.
 * Each league can be navigated to, and it also shows the relevant division and subdivision names.
 *
 * @component
 * @param {ILinkedLeagueListProps} props - Properties for the component.
 * @returns {ReactElement} A component that renders linked leagues with division and subdivision details.
 */
const LinkedLeagueList = (props: ILinkedLeagueListProps): ReactElement => {
  const { leagues, divisions, subDivisions } = props
  const navigate = useNavigate()

  const goToLeague = (id: string) => navigate(`${PATH_TO_LEAGUE_PAGE}/${id}`)

  /**
   * Renders the list of leagues, each with its division and subdivision names if available.
   *
   * @function
   * @returns {ReactElement[]} An array components, each displaying a league name with division and subdivision info.
   */
  const renderLeagues = useCallback(() => (
    leagues.map((league, index) => {
      const divisionName = divisions[index]?.name
      const subDivisionName = subDivisions[index]?.name ? `, ${subDivisions[index]?.name}` : undefined

      return (
        <Flex vertical key={league.id}>
          <MonroeLightBlueText className="c-p" onClick={() => goToLeague(league.id)}>
            {league.name}
          </MonroeLightBlueText>

          <SubText>
            {divisionName} {subDivisionName}
          </SubText>
        </Flex>
      )
    })
  ), [leagues])

  return (
    <Flex className="mb-16" align="start">
      <ViewText className="w-auto">Linked league/tourn:</ViewText>

      <Flex vertical>
        {renderLeagues()}
      </Flex>
    </Flex>
  )
}


const SubText = styled(ViewTextInfo)`
    width: auto;
    margin-top: 0;
    margin-bottom: 12px
`

export default MasterTeamDetails

