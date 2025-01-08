import { Page } from '@/layouts/Page'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { EventForm } from './components/EventForm'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useNavigate } from 'react-router-dom'
import { useCreateEventMutation } from '@/redux/events/events.api.ts'
import { TEventPracticePayload } from '@/common/types/events.ts'
import { EventFormProvider } from '@/pages/Protected/Events/components/EventForm/EventFormProvider.tsx'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_EVENTS}>Events</a> },
  { title: <MonroeBlueText>Create event</MonroeBlueText> }
]

const EventCreate = () => {
  const navigate = useNavigate()

  const [createEvent] = useCreateEventMutation()

  const goBack = () => navigate(PATH_TO_EVENTS)

  const onSubmit = (body: IEventForm) => {
    const subscribers = body.eventSubscribers

    const payload = {
      event_type: body.eventType,
      event_description: body.eventDescription,
      event_subscribers: subscribers?.length ? subscribers.join(',') : '',
      date: body.date,
      day: body.day,
      time: body.time,
      location_id: body.locationId,
      court_or_field: body.courtOrField,
      sub_resources: body.subResources,
      ignore_conflicts: body.ignoreConflicts,
      team_1_id: body.leagueTeam1Id,
      team_2_id: body.leagueTeam2Id || null,
      duration: body.duration
    } as TEventPracticePayload

    createEvent(payload)
  }

  return (
    <EventFormProvider>
      <Page
        title="Create Event"
        breadcrumbs={BREAD_CRUMB_ITEMS}
      >
        <>
          <EventForm
            onSubmit={onSubmit}
            goBack={goBack}
          />
        </>
      </Page>
    </EventFormProvider>
  )
}



export default EventCreate
