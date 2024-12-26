import { Page } from '@/layouts/Page'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { EventForm } from './components/EventForm'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useNavigate } from 'react-router-dom'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_EVENTS}>Events</a> },
  { title: <MonroeBlueText>Create event</MonroeBlueText> }
]

const EventCreate = () => {
  const navigate = useNavigate()

  const goBack = () => navigate(PATH_TO_EVENTS)

  const onSubmit = (body: IEventForm) => {
    alert(body)
  }

  return (
    <Page
      title="Create Event"
      breadcrumbs={BREAD_CRUMB_ITEMS}
    >
      <EventForm
        onSubmit={onSubmit}
        goBack={goBack}
      />
    </Page>
  )
}

export default EventCreate
