import { validDurations } from '@/pages/Protected/Events/components/EventForm/validation.ts'

export const eventType = {
  GAME: 0,
  PRACTICE: 1,
  PLAYOFF: 2,
  OTHER: 5
}

export const eventInitialValues = {
  eventType: 1, // Number field, initialized as empty or a default value
  eventDescription: '', // Optional string field
  eventSubscribers: '', // Optional string field
  date: '', // Required field, start empty
  day: '', // Required field, start empty
  time: '', // Required field, start empty
  duration: null, // Required number, start empty
  locationId: '', // Required field
  courtOrField: '', // Optional string field
  subResources: '', // Optional string field
  ignoreConflicts: false, // Boolean, defaults to false
  leagueTeam1Id: '', // Required field
  leagueTeam2Id: '', // Conditional field
  league: '' // Conditional field
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

