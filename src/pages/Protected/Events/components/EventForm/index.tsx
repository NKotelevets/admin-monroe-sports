import { IFormProps } from '@/common/interfaces'
import { IEventForm } from '@/common/interfaces/event.ts'
import { Form, Formik, FormikHelpers } from 'formik'
import { eventFormSchema } from '@/pages/Protected/Events/components/EventForm/validation.ts'
import { useCallback, useEffect } from 'react'
import {
  CancelButton,
  Line,
  MainContainer,
  MonroeBlueText,
  PageContent,
  ProtectedPageSubtitle
} from '@/components/Elements'
import { DatePicker, Flex, TimePicker } from 'antd'
import InputWrapper from '@/components/Inputs/InputWrapper'
import Select from '@/components/Inputs/Select.tsx'
import TextArea from 'antd/es/input/TextArea'
import dayjs, { Dayjs } from 'dayjs'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { LocationDropdown } from './LocationDropdown'
import {
  eventDurationOptions,
  eventInitialValues,
  eventRepeatOptions,
  eventType,
  eventTypeOptions, repeatType
} from '@/common/constants/events'
import { EmailTagsInput } from '@/components/Inputs/EmailTagsInput.tsx'
import { PracticeForm } from './PracticeForm.tsx'
import MonroeButton from '@/components/MonroeButton.tsx'
import { GameForm } from '@/pages/Protected/Events/components/EventForm/GameForm.tsx'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { usePageContext } from '@/layouts/Page/context.ts'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { RelatedForms } from '@/pages/Protected/Events/components/EventForm/RelatedForms.tsx'
import Tooltip from 'antd/es/tooltip'

const editEventTypeOptions = eventTypeOptions
const createEventTypeOptions = eventTypeOptions.slice(0, -1)

export const EventForm = (props: IFormProps<IEventForm, IEventForm>) => {
  const { initialValues, validationSchema, onSubmit, goBack, isLoading } = props
  const { isAddingRelated } = useEventFormContext()
  const { setPageTitle, setBreadcrumbs } = usePageContext()

  const title = initialValues ? 'Edit' : 'Create'

  /**
   * Updates the title if we're not using related forms
   */
  useEffect(() => {
    if (isAddingRelated) return

    setPageTitle(`${title} event`)
    setBreadcrumbs([
      { title: <a href={PATH_TO_EVENTS}>Events</a> },
      { title: <MonroeBlueText>{title} event</MonroeBlueText> }
    ])
  }, [isAddingRelated, initialValues])

  const handleSubmit = useCallback((values: IEventForm, formikHelpers?: FormikHelpers<IEventForm>) => {
    onSubmit(values, formikHelpers)
  }, [])

  return (
    <Formik
      initialValues={initialValues || eventInitialValues}
      validationSchema={validationSchema || eventFormSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({
          values,
          handleChange,
          handleSubmit,
          errors,
          handleBlur,
          touched,
          setFieldValue,
          setFieldError,
          setFieldTouched,
          isValid,
          dirty
        }) => {

        if (isAddingRelated) {
          return <RelatedForms />
        }

        return (
          <Form onSubmit={handleSubmit} className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Event type</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <Select
                    label="Type *"
                    placeholder="Select type"
                    value={values.eventType}
                    options={initialValues ? editEventTypeOptions : createEventTypeOptions}
                    onChange={value => {
                      setFieldValue('team1Id', undefined)
                      setFieldValue('team2Id', undefined)
                      setFieldValue('repeats', repeatType.NO_REPEAT)
                      setFieldValue('endRepeat', undefined)
                      setFieldValue('duration', undefined)
                      setFieldValue('season', undefined)
                      setFieldValue('league', undefined)
                      setFieldValue('team1Name', undefined)
                      setFieldValue('team2Name', undefined)
                      setFieldValue('coach1Name', undefined)
                      setFieldValue('coach2Name', undefined)
                      setFieldValue('season1Name', undefined)
                      setFieldValue('season2Name', undefined)
                      setFieldValue('league1Name', undefined)
                      setFieldValue('league2Name', undefined)
                      setFieldValue('eventType', value)
                    }}
                    onBlur={handleBlur('eventType')}
                    error={touched.eventType ? errors.eventType : undefined}
                  />

                  <InputWrapper
                    label="Event Description"
                    value={values.eventDescription}
                    error={touched.eventDescription ? errors.eventDescription : undefined}
                  >
                    <TextArea
                      onChange={handleChange('eventDescription')}
                      placeholder="Enter description"
                      onBlur={handleBlur('eventDescription')}
                      value={values.eventDescription}
                    >
                      {values.eventDescription}
                    </TextArea>
                  </InputWrapper>
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Day & Time</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <InputWrapper
                    label="Start Date *"
                    errorPosition="top"
                    error={touched.date ? errors.date : undefined}
                  >
                    <DatePicker
                      format="MMMM D, YYYY"
                      placeholder="Select date"
                      value={values.date ? dayjs(values.date, 'YYYY-MM-DD') : null}
                      onChange={(value: Dayjs) => {
                        setFieldValue('date', value ? value.format('YYYY-MM-DD') : null)
                        setFieldValue('day', value ? value.format('dddd') : null)
                      }}
                      status={touched.date && errors.date ? 'error' : undefined}
                    />
                  </InputWrapper>

                  <TextInput
                    name="day"
                    label="Day"
                    disabled={true}
                    value={values.day}
                  />

                  <InputWrapper
                    label="Start Time *"
                    errorPosition="top"
                    error={touched.time ? errors.time : undefined}
                  >
                    <TimePicker
                      format="hh:mm A"
                      placeholder="Select time"
                      value={values.time ? dayjs(values.time, 'HH:mm:ss') : null}
                      onChange={(value: Dayjs) => {
                        setFieldValue('time', value ? value.format('HH:mm:00') : value)
                      }}
                      onOk={(value: Dayjs) => {
                        setFieldValue('time', value ? value.format('HH:mm:00') : value)
                      }}
                      status={touched.time && errors.time ? 'error' : undefined}
                    />
                  </InputWrapper>

                  <Select
                    label="Duration *"
                    placeholder="Select duration"
                    value={values.duration}
                    options={eventDurationOptions}
                    onChange={value => setFieldValue('duration', value)}
                    onBlur={handleBlur('duration')}
                    error={touched.duration ? errors.duration : undefined}
                  />

                </MainContainer>
              </Flex>

              {values.eventType !== eventType.GAME && values.eventType !== eventType.PLAYOFF && (
                <>
                  <Line />

                  <Flex>
                    <div className="f-40">
                      <ProtectedPageSubtitle>Repeats</ProtectedPageSubtitle>
                    </div>
                    <MainContainer>
                      <Tooltip autoAdjustOverflow>
                        <Select
                          label="Repeats *"
                          placeholder="Select repeat"
                          value={values.repeats}
                          disabled={!values.date}
                          options={eventRepeatOptions}
                          onChange={value => setFieldValue('repeats', value)}
                          onBlur={handleBlur('repeats')}
                          error={touched.repeats ? errors.repeats : undefined}
                          tooltipTitle={!values.date ? 'Please, choose the event date to edit this field' : undefined}
                        />
                      </Tooltip>

                      <InputWrapper
                        label="End Repeat *"
                        errorPosition="top"
                        error={touched.endRepeat ? errors.endRepeat : undefined}
                      >
                        <DatePicker
                          format="MMMM D, YYYY"
                          disabled={!values.date || values.repeats === repeatType.NO_REPEAT}
                          placeholder="Select end date"
                          minDate={values.date ? dayjs(values.date, 'YYYY-MM-DD').add(1, 'day') : undefined}
                          // onBlur={handleBlur('endRepeat')}
                          value={values.endRepeat ? dayjs(values.endRepeat, 'YYYY-MM-DD') : null}
                          onChange={(value: Dayjs) => handleChange('endRepeat')(value.format('YYYY-MM-DD'))}
                          status={touched.endRepeat && errors.endRepeat ? 'error' : undefined}
                        />
                      </InputWrapper>
                    </MainContainer>
                  </Flex>
                </>
              )}

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Location</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <LocationDropdown  />

                  <TextInput
                    name="courtOrField"
                    label="Court / Field"
                    placeholder="Enter court / field"
                    value={values.courtOrField}
                    onChange={handleChange('courtOrField')}
                    onBlur={handleBlur('courtOrField')}
                    error={touched.courtOrField ? errors.courtOrField : undefined}
                  />

                  <TextInput
                    name="subResources"
                    label="Sub Resource"
                    value={values.subResources}
                    placeholder="Enter sub resource"
                    onChange={handleChange('subResources')}
                    onBlur={handleBlur('subResources')}
                    error={touched.subResources ? errors.subResources : undefined}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Team(s)</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  {(values.eventType === eventType.PRACTICE || values.eventType === eventType.OTHER) &&
                    <PracticeForm />}
                  {(values.eventType === eventType.GAME || values.eventType === eventType.PLAYOFF) && <GameForm />}
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Event subscribers</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <EmailTagsInput
                    label="Subscribers"
                    helpText="To add more than 1 subscriber, enter their emails with “,” or a space."
                    value={values.eventSubscribers || []} // Controlled input
                    onChange={(value) => setFieldValue('eventSubscribers', value)}
                    error={errors.eventSubscribers}
                    onError={(value) => setFieldError('eventSubscribers', value)}
                    onBlur={() => setFieldTouched('eventSubscribers')}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40" />
                <Flex>
                  <CancelButton type="default" onClick={goBack}>
                    Cancel
                  </CancelButton>

                  <MonroeButton
                    type="primary"
                    className="h-40"
                    isLoading={isLoading}
                    isDisabled={!dirty || !isValid}
                    label={`${title} Event`}
                    onClick={handleSubmit}
                  />
                </Flex>
              </Flex>
            </PageContent>
          </Form>
        )
      }}
    </Formik>
  )
}
