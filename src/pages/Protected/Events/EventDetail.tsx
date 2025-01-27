import { Page } from '@/layouts/Page'
import { useCallback, useEffect, useState } from 'react'
import { PATH_TO_EDIT_EVENT, PATH_TO_EVENTS, PATH_TO_LOCATION, PATH_TO_USERS } from '@/common/constants/paths.ts'
import { MonroeBlueText, ViewText } from '@/components/Elements'
import { Flex, Row, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useBulkDeleteEventsMutation, useGetEventQuery } from '@/redux/events/events.api.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { IDetailedError } from '@/common/interfaces'
import Loader from '@/components/Loader.tsx'
import { Button } from '@/components/Button.tsx'
import { EditOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import MonroeModal from '@/components/MonroeModal.tsx'
import { eventRepeatName, eventTypeByValue, repeatType } from '@/common/constants/events.ts'
import CellText from '@/components/Table/CellText.tsx'
import { Dot } from '../MasterTeams/components/SimpleEntityList'
import dayjs from 'dayjs'
import { getTeam, getTeamAdmin, getTeamHeadCoach, getTeamUrl } from '@/pages/Protected/Events/utils.ts'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import { IFESimpleEntity, ITeamAdmin } from '@/common/interfaces/masterTeams.ts'
import { IEvent } from '@/common/interfaces/event.ts'

type TTeamDataProps = {
  title: string

  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string | null
}

type TTeamProps = {
  last?: boolean
  team: {
    rsvp: IEvent['rsvpAnswers']
    id?: string
    name?: string
    url: string,
    teamAdmin?: ITeamAdmin[] | null
    coach?: Omit<IFESimpleEntity, 'fullName'> & {   firstName: string;   lastName: string;   phoneNumber?: string | undefined; }
  }
}

const EventDetail = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEvent] = useBulkDeleteEventsMutation()

  const { notify } = useNotification()
  const {
    data,
    isLoading,
    isError,
    error
  } = useGetEventQuery({ id: params.id || '' }, { skip: !params.id })

  /**
   * Redirects to the events main table if there is an error fetching the event,
   * and displays an error notification.
   */
  useEffect(() => {
    if (isError) {
      navigate(PATH_TO_EVENTS)
      notify((error as IDetailedError).details, 'error')
    }
  }, [isError])

  const renderControls = useCallback(() => {
    const onEdit = () => navigate(`${PATH_TO_EDIT_EVENT}/${data?.id}`)

    return (
      <>
        <Button
          danger={true}
          icon={<DeleteOutlined />}
          onClick={() => setShowDeleteModal(true)}
        >Delete</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
      </>
    )
  }, [data])

  const handleDelete = useCallback((id: string) => {
    deleteEvent([id])
      .unwrap()
      .then(() => navigate(PATH_TO_EVENTS))
      .catch((error) => {
        setShowDeleteModal(false)
        notify((error as IDetailedError).details, 'error')
      })
  }, [])

  // Render a loading indicator if data is still loading or unavailable
  if (isLoading || !data) return <Loader />

  const eventTitle = eventTypeByValue[data.type]

  const breadCrumbs = [
    { title: <a href={PATH_TO_EVENTS}>Events</a> },
    { title: <MonroeBlueText>{eventTitle}</MonroeBlueText> }
  ]

  const team1 = getTeam({
    event: data,
    masterTeam: data.homeTeam,
    leagueTeam: data.homeLeagueTeam
  })
  const team2 = getTeam({
    event: data,
    masterTeam: data.awayTeam,
    leagueTeam: data.awayLeagueTeam
  })

  const teamOne = {
    id: team1?.id,
    name: team1?.name,
    url: getTeamUrl(data),
    teamAdmin: getTeamAdmin(data, team1),
    rsvp: data.rsvpAnswers,
    coach: getTeamHeadCoach({
      event: data,
      masterTeam: data.homeTeam,
      leagueTeam: data.homeLeagueTeam
    }) as TTeamProps['team']['coach']
  }

  const teamTwo = {
    id: team2?.id,
    name: team2?.name,
    url: getTeamUrl(data),
    teamAdmin: getTeamAdmin(data, team2),
    rsvp: data.rsvpAnswers,
    coach: getTeamHeadCoach({
      event: data,
      masterTeam: data.awayTeam,
      leagueTeam: data.awayLeagueTeam
    }) as TTeamProps['team']['coach']
  }

  return (
    <>
      {showDeleteModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => handleDelete(params.id as string)}
          title={`Delete ${eventTitle}?`}
          type="warn"
          content={<p>Are you sure you want to delete this {eventTitle}?</p>}
        />
      )}
      <Page
        title={eventTitle}
        breadcrumbs={breadCrumbs}
        controls={renderControls}
      >
        <Flex vertical>
          <Row className="mb-16">
            <ViewText>Event Description:</ViewText>
            <Flex vertical>
              <CellText>{data.eventDescription || '-'}</CellText>
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Day:</ViewText>
            <Flex vertical={false} align="center">
              <CellText>{dayjs(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY') || '-'}</CellText>
              <Dot />
              <CellText>{dayjs(data.date, 'YYYY-MM-DD').format('dddd')}</CellText>
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Start time:</ViewText>
            <Flex vertical>
              <CellText>{dayjs(data.time, 'HH:mm:ss').format('hh:mm A')}</CellText>
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Duration:</ViewText>
            <Flex vertical>
              <CellText>{data.duration} minutes</CellText>
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Location:</ViewText>
            <Flex vertical={false} align="center">
              <Typography.Link href={`${PATH_TO_LOCATION}/${data.location.id}`}>{data.location.name}</Typography.Link>
              {!!data.courtOrField && (
                <>
                  <Dot />
                  <CellText>Court {data.courtOrField}</CellText>
                </>
              )}
              {!!data.subResource && (
                <>
                  <Dot />
                  <CellText>Sub Resource {data.subResource}</CellText>
                </>
              )}
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Repeats:</ViewText>
            <Flex vertical>
              <CellText>{eventRepeatName[data.repeats || repeatType.NO_REPEAT]}</CellText>
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Team(s):</ViewText>
            <Flex vertical>
              <Team team={teamOne} />
              {team2 && (
                <Team team={teamTwo} last />
              )}
            </Flex>
          </Row>

          <Row className="mb-16">
            <ViewText>Event Subscriber(s):</ViewText>
            <Flex vertical>
              {data.eventSubscribers && (
                data.eventSubscribers.split(',').map(email => (
                  <Typography.Link href={`mailto:${email}`} key={email}>{email}</Typography.Link>
                ))
              )}
              {!data.eventSubscribers && <CellText>-</CellText>}
            </Flex>
          </Row>

          {/*<Row className="mb-16">*/}
          {/*  <ViewText>Create By:</ViewText>*/}
          {/*  <Flex>*/}
          {/*    <Typography.Link underline href={`${PATH_TO_USERS}/${data.whoCreated}`}>*/}
          {/*      {data.whoCreated}*/}
          {/*    </Typography.Link>*/}
          {/*    <>&nbsp;&nbsp;</>*/}
          {/*    <CellText>{dayjs(data.createdAt).format('h:mm A, DD/MM/YYYY')}</CellText>*/}
          {/*  </Flex>*/}
          {/*</Row>*/}

          {/*<Row className="mb-16">*/}
          {/*  <ViewText>Last update:</ViewText>*/}
          {/*  <Flex>*/}
          {/*    <Typography.Link underline href={`${PATH_TO_USERS}/${data.whoCreated}`}>*/}
          {/*      {data.whoCreated}*/}
          {/*    </Typography.Link>*/}
          {/*    <>&nbsp;&nbsp;</>*/}
          {/*    <CellText> {dayjs(data.updatedAt).format('h:mm A, DD/MM/YYYY')}</CellText>*/}
          {/*  </Flex>*/}
          {/*</Row>*/}
        </Flex>
      </Page>
    </>
  )
}

export default EventDetail

const Team = (props: TTeamProps) => {
  const { team, last } = props
  const style = last ? { marginTop: 16 } : undefined

  return (
    <Flex vertical style={style}>
      <Typography.Link href={`${team.url}/${team.id}`}>{team.name}</Typography.Link>
      <Flex vertical>
        {team.teamAdmin?.map(admin => (
          <TeamData
            title="Team admin"
            firstName={admin?.firstName}
            lastName={admin?.lastName}
            email={admin?.email}
            phone={admin?.phoneNumber}
          />
        ))}
        <TeamData
          title="Coach"
          firstName={team.coach?.firstName}
          lastName={team.coach?.lastName}
          email={team.coach?.email}
          phone={team.coach?.phoneNumber}
        />
        <Data align="center">
          RSVP:
          <InfoDetails align="center">
            Ok <RSVPNumber>{team.rsvp.going}</RSVPNumber><Dot />
            No <RSVPNumber>{team.rsvp.notGoing}</RSVPNumber><Dot />
            No Response <RSVPNumber>{team.rsvp.noReply}</RSVPNumber>
          </InfoDetails>
        </Data>
      </Flex>
    </Flex>
  )
}

const TeamData = (props: TTeamDataProps) => {
  const {
    title,
    id,
    firstName,
    lastName,
    email,
    phone
  } = props

  return (
    <Flex vertical>
      {firstName && (
        <Data align="center">
          {title}:
          <InfoDetails align="center">
            {firstName && (
              <Typography.Link href={`${PATH_TO_USERS}/${id}`}>{firstName} {lastName}</Typography.Link>
            )}
            {email && (
              <>
                <Dot />
                <Typography.Link href={`mailto:${email}`}>{email}</Typography.Link>
              </>
            )}
            {phone && (
              <>
                <Dot />
                <Typography.Text copyable>{phone}</Typography.Text>
              </>
            )}
          </InfoDetails>
        </Data>
      )}
    </Flex>
  )
}


// Styled Components
const Data = styled(Flex)`
    font-size: 12px !important;
    margin-top: 4px;
    line-height: 1.5714285714285714;
    color: ${colors.secondaryText};

    & .ant-typography {
        font-size: 12px !important;
    }
`
const InfoDetails = styled(Flex)`
    margin-left: 6px
`
const RSVPNumber = styled(Flex)`
    font-size: 12px;
    margin-left: 4px;
    color: ${colors.secondary}
`
