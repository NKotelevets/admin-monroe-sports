import { IFormProps } from '@/common/interfaces'
import { IEventForm } from '@/common/interfaces/event.ts'

import { Form, Formik } from 'formik'
import { eventFormSchema } from '@/pages/Protected/Events/components/EventForm/validation.ts'
import { useCallback, useState } from 'react'
import { MainContainer, PageContent, ProtectedPageSubtitle } from '@/components/Elements'
import { DatePicker, Divider, Flex, TimePicker } from 'antd'
import styled from '@emotion/styled'
import InputWrapper from '@/components/Inputs/InputWrapper'
import Select from '@/components/Inputs/Select.tsx'
import TextArea from 'antd/es/input/TextArea'
import dayjs, { Dayjs } from 'dayjs'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { LocationDropdown } from './LocationDropdown'
import { eventDurationOptions, eventInitialValues, eventTypeOptions } from '@/common/constants/events'


export const EventForm = (props: IFormProps<IEventForm, IEventForm>) => {
  const { initialValues, validationSchema, onSubmit } = props

  const [addingLocation, setAddingLocation] = useState(false)

  const handleSubmit = useCallback((values: IEventForm) => {
    // TODO: check if something is needed here
    onSubmit(values)
  }, [])

  const onAddLocation = () => {

  }

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
          setFieldValue
        }) => {

        if (addingLocation) {
          return <>Adding Location</>
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
                    options={eventTypeOptions}
                    onChange={value => setFieldValue('eventType', value)}
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
                      placeholder="Event description"
                      onBlur={handleBlur('eventDescription')}
                    ></TextArea>
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
                      minDate={dayjs(new Date())}
                      onBlur={handleBlur('date')}
                      value={values.date ? dayjs(values.date, 'YYYY-MM-DD') : null}
                      onChange={(value: Dayjs) => {
                        handleChange('date')(value.format('YYYY-MM-DD'))
                        setFieldValue('day', value.format('dddd'))
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
                        setFieldValue('time', value.format('HH:mm:00'))
                      }}
                      onOk={(value: Dayjs) => {
                        setFieldValue('time', value.format('HH:mm:00'))
                      }}
                      status={touched.time && errors.time ? 'error' : undefined}
                    />
                  </InputWrapper>

                  <Select
                    label="Duration *"
                    placeholder="Select type"
                    value={values.duration}
                    options={eventDurationOptions}
                    onChange={value => setFieldValue('duration', value)}
                    onBlur={handleBlur('duration')}
                    error={touched.duration ? errors.duration : undefined}
                  />

                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Location</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <LocationDropdown
                    setAddingLocation={setAddingLocation}
                    onAddLocation={onAddLocation}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Team(s)</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  oi
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Event subscribers</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  oi
                </MainContainer>
              </Flex>

            </PageContent>
          </Form>
        )
      }}
    </Formik>
  )
}

const Line = styled(Divider)`
    margin: 24px 0 !important
`
