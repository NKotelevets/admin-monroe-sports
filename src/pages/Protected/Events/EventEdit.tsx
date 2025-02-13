import { Page } from '@/layouts/Page'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { EventForm } from './components/EventForm'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditEventMutation, useGetEventQuery } from '@/redux/events/events.api.ts'
import { TEventEditingPayload } from '@/common/types/events.ts'
import { EventFormProvider } from '@/pages/Protected/Events/components/EventForm/EventFormProvider.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { FormikHelpers } from 'formik'
import { DEFAULT_ERROR_MESSAGE } from '@/common/constants'
import Loader from '@/components/Loader.tsx'
import { eventInitialValues, eventType, repeatType } from '@/common/constants/events.ts'
import dayjs from 'dayjs'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { useEventConflicts } from '@/pages/Protected/Events/hooks/useEventConflicts.tsx'

const EventEdit = () => {
  const params = useParams<{ id: string }>()

  const navigate = useNavigate()
  const [editEvent] = useEditEventMutation()

  const { notify } = useNotification()
  const { handleErrors } = useFieldErrors<IEventForm>()
  const { handleConflicts } = useEventConflicts()
  const { data, isLoading, isError } = useGetEventQuery(
    { id: params?.id || '' },
    { skip: !params?.id }
  )

  const goBack = () => navigate(PATH_TO_EVENTS)

  const onSubmit = (body: IEventForm, formikHelpers: FormikHelpers<IEventForm>) => {
    const subscribers = body.eventSubscribers
    const { setErrors } = formikHelpers

    let payload = {
      id: params.id!,
      event_type: body.eventType,
      event_description: body.eventDescription,
      event_subscribers: subscribers?.length ? subscribers.join(',') : '',
      date: body.date,
      day: body.day,
      time: body.time,
      location_id: body.locationId,
      court_or_field: body.courtOrField,
      sub_resource: body.subResources,
      repeats: body.repeats,
      repeatEndDate: body.endRepeat,
      ignore_conflicts: body.ignoreConflicts,
      team_1_id: body.team1Id,
      team_2_id: body.team2Id || null,
      duration: body.duration
    } as TEventEditingPayload

    if (body.eventType === eventType.PLAYOFF) {
      payload = {
        ...payload,
        leagueId: body.league,
        seasonId: body.season,
        divisionId: body.division,
        bracketId: body.bracket
      }
    }

    editEvent(payload)
      .unwrap()
      .then(() => {
        notify('Event was successfully updated', 'success')
        navigate(PATH_TO_EVENTS)
      })
      .catch(handleErrors(setErrors))
      .catch(handleConflicts(onSubmit, body, formikHelpers))
      .catch(() => {
        notify(DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  if (!data || isLoading || isError) return <Loader />

  const BREAD_CRUMB_ITEMS = [
    { title: <a href={PATH_TO_EVENTS}>Events</a> },
    { title: <MonroeBlueText>Event</MonroeBlueText> }
  ]

  const getTeamId = (type: number, leagueTeam?: IFELeagueTeam, masterTeam?: IFEMasterTeam) => {
    if (type === eventType.GAME || type === eventType.PLAYOFF) {
      return leagueTeam || { id: '', name: '' } as IFELeagueTeam
    }

    return masterTeam || { id: '', name: '' } as IFEMasterTeam
  }

  const team1 = getTeamId(data.type, data.homeLeagueTeam, data.homeTeam)
  const team2 = getTeamId(data.type, data.awayLeagueTeam, data.awayTeam)

  const initialValues = {
    ...eventInitialValues,

    eventSubscribers: data.eventSubscribers?.split(',') || [],
    eventType: data.type,
    date: data.date,

    eventDescription: data.eventDescription || '',
    day: data.day || dayjs(data.date, 'YYYY-MM-DD').format('dddd'),
    time: data.time,
    duration: data.duration || 30,
    repeats: data.repeats || repeatType.NO_REPEAT,

    locationId: data.location?.id || '',
    courtOrField: data.courtOrField || '',
    subResource: data.subResource || '',

    season: data.playoffInfo?.season?.id || data.season?.id || '',
    league: typeof data.league === 'string' ? data.league : data.league?.id || '',
    division: data.playoffInfo?.division?.id || data.division?.id || '',
    bracket: data.playoffInfo?.bracket || '',
    game: data.playoffInfo?.match ?? '',

    team1Id: team1.id,
    team1Name: team1.name,
    coach1Name: data.coachHomeTeam?.fullName || '',
    season1Name: data.season?.name || '',
    league1Name: data.season?.name || '',

    team2Id: team2.id,
    team2Name: team2.name,
    coach2Name: data.coachAwayTeam?.fullName || '',
    season2Name: data.season?.name || '',
    league2Name: data.season?.name || ''
  } as IEventForm

  return (
    <EventFormProvider>
      <Page
        title="Edit Event"
        breadcrumbs={BREAD_CRUMB_ITEMS}
      >
        <EventForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          goBack={goBack}
        />
      </Page>
    </EventFormProvider>
  )
}


export default EventEdit
