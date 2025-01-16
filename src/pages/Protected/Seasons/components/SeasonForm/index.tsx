import {
  ICreateSeasonFormValues, seasonInitialFormValues,
  seasonValidationSchema
} from '@/pages/Protected/Seasons/constants/formik.ts'
import { Form, Formik } from 'formik'
import { MouseEventHandler, ReactElement, useEffect } from 'react'
import { CancelButton, MainContainer, PageContent } from '@/components/Elements'
import CreateBracket from '@/pages/Protected/Seasons/CreateBracket/CreateBracket.tsx'
import { DatePicker, Divider, Flex } from 'antd'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { LeagueTournSelect } from '@/pages/Protected/Seasons/components/SeasonForm/LeagueTournSelect.tsx'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import dayjs, { Dayjs } from 'dayjs'
import { FormSection } from '@/components/FormSection.tsx'
import { DivisionAccordion } from '@/pages/Protected/Seasons/components/SeasonForm/DivisionAccordion'
import { usePageContext } from '@/layouts/Page/context.ts'
import styled from '@emotion/styled'
import { Button } from '@/components/Button.tsx'
import { IFormProps } from '@/common/interfaces'
import { IBreadcrumbs } from '@/common/types'

interface ISeasonFormProps {
  title: string
  breadcrumbs: IBreadcrumbs
  validateOnMount?: boolean
  onSubmit(body: ICreateSeasonFormValues, ids: number[]): void
}

type TForm = Omit<IFormProps<ICreateSeasonFormValues, ICreateSeasonFormValues>, 'onSubmit'> & ISeasonFormProps

/**
 * Form component for creating and editing seasons
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The title to display for the form page
 * @param {IBreadcrumbs} props.breadcrumbs - Breadcrumb navigation data
 * @param {ICreateSeasonFormValues} [props.initialValues] - Initial form values
 * @param {Object} [props.validationSchema] - Yup validation schema
 * @param {boolean} props.isLoading - Loading state for the submit button
 * @param {Function} props.goBack - Handler for the cancel button
 * @param {Function} props.onSubmit - Form submission handler
 * @returns {ReactElement} Season form with fields for name, dates, and divisions
 */
export const SeasonForm = (props: TForm ): ReactElement => {
  const {
    title,
    breadcrumbs,
    initialValues,
    validationSchema,
    isLoading,
    goBack,
    onSubmit
  } = props
  const { showBracketPage, ids, getErrorMessage } = useSeasonFormContext()

  const handleSubmit = (values: ICreateSeasonFormValues) => {
    !!onSubmit && onSubmit(values, ids)
  }

  return (
    <Formik
      initialValues={initialValues || seasonInitialFormValues}
      validationSchema={validationSchema || seasonValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
      enableReinitialize
    >
      {({
        values,
        handleChange,
        handleSubmit,
        errors,
        setFieldValue,
        handleBlur,
        touched,
        isValid
      }) => {

        return (
          <Form onSubmit={handleSubmit} className="league-teams">

            {showBracketPage && (
              <PageContent>
                <CreateBracket />
              </PageContent>
            )}

            {!showBracketPage && (
              <PageContent>
                <TitleUpdater title={title} breadcrumbs={breadcrumbs} />
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
                      error={getErrorMessage(errors.name, touched.name)}
                      onBlur={handleBlur('name')}
                    />

                    <LeagueTournSelect />

                    <InputWrapper
                      label="Start Date *"
                      errorPosition="top"
                      error={getErrorMessage(errors.startDate, touched.startDate)}
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
                      error={getErrorMessage(errors.expectedEndDate, touched.expectedEndDate)}
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

                  <DivisionAccordion />
                </Flex>

                <BottomDivider>
                  <Divider />
                </BottomDivider>

                <Flex>
                  <Aligned />
                  <Flex>
                    <CancelButton type="default" onClick={goBack}>Cancel</CancelButton>
                    <Button
                      type="primary"
                      size="large"
                      loading={isLoading}
                      disabled={!touched || !isValid || isLoading}
                      // spinnerColor={}
                      onClick={handleSubmit as unknown as MouseEventHandler<HTMLElement>}
                    >
                      {title}
                    </Button>
                  </Flex>
                </Flex>

              </PageContent>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

/**
 * Updates the page title and breadcrumbs when the component mounts
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The title to set for the page
 * @param {IBreadcrumbs} props.breadcrumbs - The breadcrumb navigation data to set
 * @returns {JSX.Element} Empty fragment after updating page context
 */
const TitleUpdater = (props: { title: string, breadcrumbs: IBreadcrumbs }) => {
  const { title, breadcrumbs } = props
  const { setBreadcrumbs, setPageTitle } = usePageContext()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    setPageTitle(title)
  }, [])

  return <></>
}

// Styled Components
const Aligned = styled.div`
    flex: 0 0 40%;
`
const BottomDivider = styled.div`
    margin: 18px 0 24px !important;
`
