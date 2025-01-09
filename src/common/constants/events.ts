import { validDurations } from '@/pages/Protected/Events/components/EventForm/validation.ts'

export const eventType = {
  GAME: 0,
  PRACTICE: 1,
  PLAYOFF: 2,
  OTHER: 5
}

export const eventInitialValues = {
  eventType: eventType.PRACTICE,
  eventDescription: '',
  eventSubscribers: [],
  date: '',
  day: '',
  time: '',
  duration: null,
  locationId: '',
  courtOrField: '',
  subResources: '',
  ignoreConflicts: false,
  team1Id: '',
  team2Id: '',
  league: '',
  season: '',
  repeats: 0,
  endRepeat: '',
  team1Name: undefined,
  team2Name: undefined,
  coach1Name: undefined,
  coach2Name: undefined,
  season1Name: undefined,
  season2Name: undefined,
  league1Name: undefined,
  league2Name: undefined
}

export const eventTypeOptions = [
  { label: 'Practice', value: eventType.PRACTICE },
  { label: 'Game', value: eventType.GAME },
  { label: 'Other event', value: eventType.OTHER },
  { label: 'Playoff', value: eventType.PLAYOFF }
]

export const eventDurationOptions = [
  { label: `${validDurations[0]} minutes`, value: validDurations[0] },
  { label: `${validDurations[2]} minutes`, value: validDurations[2] },
  { label: `${validDurations[3]} minutes`, value: validDurations[3] },
  { label: `${validDurations[4]} minutes`, value: validDurations[4] },
  { label: `${validDurations[5]} minutes`, value: validDurations[5] },
  { label: `${validDurations[6]} minutes`, value: validDurations[6] }
]

export const validEventTypes = () => [eventType.GAME, eventType.PRACTICE, eventType.PLAYOFF, eventType.OTHER]

export const eventRepeatOptions = [
  { label: 'No repeat', value: 0 },
  { label: 'Every day', value: 1 },
  { label: 'Every week', value: 2 }
]
