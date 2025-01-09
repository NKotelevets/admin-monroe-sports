import { Page } from '@/layouts/Page'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { EventForm } from './components/EventForm'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useNavigate } from 'react-router-dom'
import { useCreateEventMutation } from '@/redux/events/events.api.ts'
import { TEventCreationPayload } from '@/common/types/events.ts'
import { EventFormProvider } from '@/pages/Protected/Events/components/EventForm/EventFormProvider.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { FormikHelpers } from 'formik'
import { DEFAULT_ERROR_MESSAGE } from '@/common/constants'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_EVENTS}>Events</a> },
  { title: <MonroeBlueText>Create event</MonroeBlueText> }
]

const EventCreate = () => {
  const navigate = useNavigate()
  const [createEvent] = useCreateEventMutation()

  const { notify } = useNotification()
  const { handleErrors } = useFieldErrors<IEventForm>()

  const goBack = () => navigate(PATH_TO_EVENTS)

  const onSubmit = (body: IEventForm, { setErrors }: FormikHelpers<IEventForm>) => {
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
      repeats: body.repeats,
      endRepeat: body.endRepeat,
      ignore_conflicts: body.ignoreConflicts,
      team_1_id: body.team1Id,
      team_2_id: body.team2Id || null,
      duration: body.duration
    } as TEventCreationPayload

    createEvent(payload)
      .unwrap()
      .then(() => {
        notify('Event was successfully created', 'success')
        navigate(PATH_TO_EVENTS)
      })
      .catch(handleErrors(setErrors))
      .catch(reason => {
        if (reason?.conflicts) { // this is temporary, since conflicts task isn't ready yet
          notify('Conflicts with other events were found', 'error')
        } else {
          notify(DEFAULT_ERROR_MESSAGE, 'error')
        }
      })
  }

  return (
    <EventFormProvider>
      <Page
        title="Create Event"
        breadcrumbs={BREAD_CRUMB_ITEMS}
      >
        <EventForm
          onSubmit={onSubmit}
          goBack={goBack}
        />
      </Page>
    </EventFormProvider>
  )
}


export default EventCreate
