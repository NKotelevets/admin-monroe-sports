import {
  ICreateSeasonFormValues,
  seasonInitialFormValues,
  seasonValidationSchema
} from '@/pages/Protected/Seasons/constants/formik.ts'
import { Form, Formik } from 'formik'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import { useMemo } from 'react'
import { MainContainer, PageContent } from '@/components/Elements'
import CreateBracket from '@/pages/Protected/Seasons/CreateBracket/CreateBracket.tsx'
import { DatePicker, Divider, Flex } from 'antd'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { LeagueTournSelect } from '@/pages/Protected/Seasons/components/SeasonForm/LeagueTournSelect.tsx'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { SeasonFormProvider } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormProvider.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import dayjs, { Dayjs } from 'dayjs'
import { FormSection } from '@/components/FormSection.tsx'
import DivisionPoolForm from '@/pages/Protected/Seasons/components/SeasonForm/DivisionField.tsx'

export const SeasonForm = () => {
  const { selectedLeague } = useSeasonSlice()
  const { showBracketPage } = useSeasonFormContext()

  const initialValues: ICreateSeasonFormValues = useMemo(() => {
    if (!selectedLeague)
      return seasonInitialFormValues

    return { ...seasonInitialFormValues, league: selectedLeague.id }
  }, [selectedLeague])

  const handleSubmit = () => {

  }

  return (
    <SeasonFormProvider>
      <Formik
        initialValues={initialValues}
        validationSchema={seasonValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
        validateOnMount
      >
        {({
            values,
            handleChange,
            handleSubmit,
            errors,
            setFieldValue,
            handleBlur,
            touched,
            setFieldTouched
          }) => {

          return (
            <Form onSubmit={handleSubmit} className="league-teams">

              {showBracketPage && (
                <PageContent>
                  <CreateBracket
                    setFieldValue={setFieldValue}
                    values={values}
                    handleBlur={handleBlur}
                    touched={touched}
                    setFieldTouched={setFieldTouched}
                  />
                </PageContent>
              )}

              {!showBracketPage && (
                <PageContent>
                  <Flex>
                    <FormSection
                      title="Main Info"
                      isFirst={true}
                      showDivider={false}
                    />

                    <MainContainer>
                      <TextInput
                        name="name"
                        value={values.name}
                        onChange={handleChange('name')}
                        placeholder="Enter season"
                        label="Name *"
                        error={touched.name ? errors.name : ''}
                        onBlur={handleBlur('name')}
                      />

                      <LeagueTournSelect />

                      <InputWrapper
                        label="Start Date *"
                        errorPosition="top"
                        error={touched.startDate ? errors.startDate : ''}
                      >
                        <DatePicker
                          format="MMMM D, YYYY"
                          placeholder="Select date"
                          maxDate={dayjs(values.expectedEndDate)}
                          value={values.startDate ? dayjs(values.startDate, 'YYYY-MM-DD') : null}
                          onChange={(value: Dayjs) => {
                            setFieldValue('expectedEndDate', null)
                            handleChange('startDate')(value.format('YYYY-MM-DD'))
                          }}
                        />
                      </InputWrapper>

                      <InputWrapper
                        label="End Date *"
                        errorPosition="top"
                        error={touched.expectedEndDate ? errors.expectedEndDate : ''}
                      >
                        <DatePicker
                          format="MMMM D, YYYY"
                          placeholder="Select date"
                          minDate={dayjs(values.startDate)}
                          value={values.expectedEndDate ? dayjs(values.expectedEndDate, 'YYYY-MM-DD') : null}
                          onChange={(value: Dayjs) => handleChange('expectedEndDate')(value.format('YYYY-MM-DD'))}
                        />
                      </InputWrapper>
                    </MainContainer>
                  </Flex>

                  <Divider />

                  <Flex>
                    <FormSection
                      title="Division/Pool"
                      subtitle="Preselection for some settings is made based on the default settings of the linked league/tournament."
                    />

                    <DivisionPoolForm />
                  </Flex>

                </PageContent>
              )}
            </Form>
          )
        }}
      </Formik>
    </SeasonFormProvider>
  )
}
