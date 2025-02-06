import { validDurations } from '@/pages/Protected/Events/components/EventForm/validation.ts'

export const eventType: Record<string, number> = {
  GAME: 0,
  PRACTICE: 1,
  PLAYOFF: 2,
  OTHER: 5
}

export const repeatType = {
  NO_REPEAT: 'NO_REPEAT',
  EVERY_DAY: 'EVERY_DAY',
  EVERY_WEEK: 'EVERY_WEEK',
}

export const eventTypeByValue: { [key: number]: string } = {
  0: 'Game',
  1: 'Practice',
  2: 'Playoff',
  5: 'Other'
}

export const eventInitialValues = {
  eventType: eventType.PRACTICE,
  eventDescription: '',
  eventSubscribers: [],
  date: '',
  day: '',
  time: '',
  duration: null,
  locationId: undefined,
  courtOrField: '',
  subResources: '',
  ignoreConflicts: false,
  team1Id: undefined,
  team2Id: undefined,
  league: undefined,
  season: undefined,
  repeats: repeatType.NO_REPEAT,
  repeatEndDate: '',
  team1Name: undefined,
  team2Name: undefined,
  coach1Name: undefined,
  coach2Name: undefined,
  season1Name: undefined,
  season2Name: undefined,
  league1Name: undefined,
  league2Name: undefined,
  division: undefined,
  bracket: undefined,
  game: undefined,

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
  { label: 'No repeat', value: repeatType.NO_REPEAT },
  { label: 'Every day', value: repeatType.EVERY_DAY },
  { label: 'Every week', value: repeatType.EVERY_WEEK }
]

export const eventRepeatName: { [key: string]: string } = {
  [repeatType.NO_REPEAT]: 'No repeat',
  [repeatType.EVERY_DAY]: 'Every day',
  [repeatType.EVERY_WEEK]: 'Every week'
}
