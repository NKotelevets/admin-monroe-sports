import * as yup from 'yup'
import dayjs from 'dayjs'
import { eventType, repeatType, validEventTypes } from '@/common/constants/events.ts'

const validWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const validDurations = [30, 45, 60, 75, 90, 105, 120]

export const eventFormSchema = yup.object({
  eventType: yup.number().test(
    'is-valid-type',
    'Invalid event type',
    (value) => value !== undefined ? validEventTypes().includes(value) : false
  ).required(),
  eventDescription: yup.string(),
  eventSubscribers: yup.array().nullable().of(yup.string()),
  date: yup
    .string()
    .required('Date is required')
    .test('is-valid-date', 'Date must be a valid format', (value) => dayjs(value, 'YYYY-MM-DD', true).isValid()),
  day: yup
    .string()
    .required('Day is required')
    .oneOf(validWeekdays, 'Day must be a valid weekday name (e.g., monday)'),
  time: yup
    .string()
    .required('Time is required')
    .test('is-valid-time', 'Time must be a valid format', (value) => dayjs(value, 'HH:mm:ss', true).isValid()),
  duration: yup
    .number()
    .required('Duration is required')
    .oneOf(validDurations, `Duration must be one of ${validDurations.join(', ')}`)
    .when('eventType', ([evt], schema) =>
      evt === eventType.PLAYOFF ? schema.oneOf([60], 'Duration must be 60 minutes for Playoff events') : schema
    ),
  locationId: yup.string().required('Location is required'),
  courtOrField: yup.string(),
  subResources: yup.string(),
  ignoreConflicts: yup.boolean(),
  team1Id: yup.string().required('Team 1 is required'),
  repeats: yup.string(),
  endRepeat: yup.string()
    .when('repeats', ([repeats], schema) =>
      repeats !== repeatType.NO_REPEAT ? schema.required('End repeat is requited when repeats is set') : schema.optional()
    ),
  team2Id: yup
    .string()
    .nullable()
    .when('eventType', ([evt], schema) =>
      evt === eventType.GAME || evt === eventType.PLAYOFF ? schema.required('Team 2 is required for this event type') : schema.optional()
    ),
  league: yup
    .string()
    .when('eventType', ([evt], schema) =>
      evt === eventType.GAME || evt === eventType.PLAYOFF ? schema.required('League is required for this event type') : schema.optional()
    )
    .when('eventType', ([eventType], schema) =>
      eventType === 0 || eventType === 2
        ? schema.required('League is required for this event type')
        : schema.optional(),
    ),
})

const eventSchema = yup.object().shape({
  eventDescription: yup.string(),
  date: yup
    .string()
    .required('Date is required')
    .test('is-valid-date', 'Date must be a valid format', (value) => dayjs(value, 'YYYY-MM-DD', true).isValid()),
  day: yup.string().required('Day is required').oneOf(validWeekdays, 'Day must be a valid weekday name (e.g., monday)'),
  time: yup
    .string()
    .required('Time is required')
    .test('is-valid-time', 'Time must be a valid format', (value) => dayjs(value, 'HH:mm:ss', true).isValid()),
  duration: yup
    .number()
    .required('Duration is required')
    .oneOf(validDurations, `Duration must be one of ${validDurations.join(', ')}`)
    .when('type', ([type], schema) =>
      type === eventType.PLAYOFF ? schema.oneOf([60], 'Duration must be 60 minutes for Playoff events') : schema,
    ),
  locationId: yup.string().required('Location is required'),
  courtOrField: yup.string(),
  subResources: yup.string(),
  ignoreConflicts: yup.boolean(),
  team1Id: yup.string().required('Team 1 is required'),
  team2Id: yup
    .string()
    .nullable()
    .when('type', ([type], schema) =>
      type === eventType.GAME || type === eventType.PLAYOFF
        ? schema.required('Team 2 is required')
        : schema.optional(),
    ),
})
const eventsSchema = yup.lazy((value) =>
  yup.object(
    Object.keys(value || {}).reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      acc[key] = eventSchema // Apply the event schema to each dynamic key
      return acc
    }, {}),
  ),
)
export const eventBulkEditFormSchema = yup.object().shape({
  events: eventsSchema,
})
